import apiClient from "../api/apiClient";

export interface Feed {
  createAt: string;
  updateAt: string;
  avatar: string;
  title: string;
  shortDecription: string;
  decription: string;
  author: string;
  id: string;
}

export const getFeed = async (): Promise<Feed[]> => {
  try {
    const response = await apiClient.get<Feed[]>("/FeedStat");
    return response.data;
  } catch (error) {
    console.error("Error fetching feed:", error);
    throw error;
  }
};
