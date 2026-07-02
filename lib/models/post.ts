import {User} from "@/app/generated/prisma/client";

export interface PublicPost {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostWithAuthor extends PublicPost {
    author: {
        id: string;
        name: string;
        email: string;
    }
}

export interface PostFilter {
    search?: string;
    published?: boolean;
    authorId?: string;
}