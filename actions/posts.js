"use server"
import { uploadImage } from '@/lib/cloudinary';
import { storePost, updatePostLikeStatus } from '@/lib/posts';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
export async function createPost(prevState, formData) {
    const title = formData.get('title');
    const image = formData.get('image');
    const content = formData.get('content');

    console.log(title)
    let error = [];

    if (!title || title.trim().length === 0) {
        error.push("Title is Required")
    }
    if (!content || content.trim().length === 0) {
        error.push("Content is Required")
    }
    if (!image || image.size === 0) {
        error.push("Image is Required")
    }

    if (error.lenght > 0) {
        return { error };
    }

    let imageUrl;
    try{
        imageUrl = await uploadImage(image);
    }
    catch(err){
        throw new Error(
            'Image upload failed, post was not created. Please try again later.'
        )
    }

    await storePost({
        imageUrl: imageUrl,
        title,
        content,
        userId: 1
    })
    revalidatePath('/', 'layout');

    redirect('/feed')
}


export async function togglePostLikeStatus(postId, formData){
    await updatePostLikeStatus(postId,2);
    revalidatePath('/','layout');
}