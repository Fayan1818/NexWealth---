import { apiClient } from "./client";
import { UserProfile, UserProfileUpdateInput } from "@/types/profile";

export async function getUserProfile(): Promise<UserProfile> {
  return apiClient<UserProfile>("/profile");
}

export async function updateUserProfile(
  input: UserProfileUpdateInput
): Promise<UserProfile> {
  return apiClient<UserProfile>("/profile", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
