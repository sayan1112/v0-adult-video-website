'use server'

import { createVideo, rateVideo, createUser, getUserByEmail, User, deleteVideo, addToWatchHistory, updateUserTokens } from "@/lib/db";
import { createSession, deleteSession, getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const formSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  category: z.string().min(1),
  video_url: z.string().min(1), 
  thumbnail_url: z.string().optional().or(z.literal("")),
});

export async function registerAction(data: z.infer<typeof registerSchema>) {
    const validated = registerSchema.safeParse(data);
    if (!validated.success) return { success: false, error: "Invalid data" };

    const { name, email, password } = validated.data;

    // Check existing
    const existingUser = await getUserByEmail(email);
    if (existingUser) return { success: false, error: "User already exists" };

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    // First user is admin automatically for demo purposes, or hardcoded logic
    // For now, default to 'user', unless email is specific admin one
    const role = email.includes('admin') ? 'admin' : 'user';

    const newUser = await createUser({
        name,
        email,
        password: hashedPassword,
        role
    });

    // Create session
    await createSession({ id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name });

    return { success: true };
}

export async function loginAction(data: z.infer<typeof loginSchema>) {
    const validated = loginSchema.safeParse(data);
    if (!validated.success) return { success: false, error: "Invalid data" };

    const { email, password } = validated.data;

    const user = await getUserByEmail(email);
    if (!user || !user.password) return { success: false, error: "Invalid credentials" };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { success: false, error: "Invalid credentials" };

    await createSession({ id: user.id, email: user.email, role: user.role, name: user.name });

    return { success: true, role: user.role };
}

export async function logoutAction() {
    await deleteSession();
    redirect('/login');
}

export async function deleteVideoAction(id: string) {
    await deleteVideo(id);
    revalidatePath('/admin');
    return { success: true };
}


export async function uploadVideoAction(formData: FormData) {
    const session = await getSession();
    if (!session) {
        return { success: false, error: "You must be logged in to upload." };
    }

    let videoUrl = formData.get('video_url') as string;
    const videoFile = formData.get('video_file') as File | null;

    // Handle File Upload
    if (videoFile && videoFile.size > 0) {
        try {
            const buffer = Buffer.from(await videoFile.arrayBuffer());
            const fileName = `${randomUUID()}-${videoFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const uploadDir = join(process.cwd(), 'public', 'uploads');
            const filePath = join(uploadDir, fileName);
            
            await writeFile(filePath, buffer);
            videoUrl = `/uploads/${fileName}`;
        } catch (error) {
             console.error("File Upload Error:", error);
             return { success: false, error: "Failed to save video file." };
        }
    }

    const rawData = {
        title: formData.get('title') as string,
        description: (formData.get('description') as string) || undefined,
        category: formData.get('category') as string,
        video_url: videoUrl,
        thumbnail_url: (formData.get('thumbnail_url') as string) || undefined,
    }

    // Validate
    const validatedFields = formSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.error("Validation Error:", validatedFields.error.flatten());
        return { success: false, error: "Validation failed. Please check your inputs.", details: validatedFields.error.flatten() };
    }

    const { title, description, category, video_url, thumbnail_url } = validatedFields.data;

    try {
        await createVideo({
            title,
            description: description || null,
            category,
            video_url,
            thumbnail_url: thumbnail_url || null,
            duration: null, 
            uploaderId: session.user.id
        });
        
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error("Database Error:", e);
        return { success: false, error: "Database error: " + (e instanceof Error ? e.message : String(e)) };
    }
}

export async function rateVideoAction(id: string, rating: number) {
    try {
        await rateVideo(id, rating);
        revalidatePath(`/video/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Rating Error:", error);
        return { success: false, error: "Failed to save rating" };
    }
}

export async function addToHistoryAction(videoId: string) {
    const session = await getSession();
    if(session) {
        await addToWatchHistory(session.user.id, videoId);
    }
}

export async function addTokensAction(amount: number) {
    const session = await getSession();
    if(!session) return { success: false, error: "Not logged in" };
    
    await updateUserTokens(session.user.id, amount);
    revalidatePath('/profile');
    return { success: true };
}
