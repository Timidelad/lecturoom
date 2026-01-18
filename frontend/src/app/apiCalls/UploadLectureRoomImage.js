import axios from "@/lib/axios";

export const uploadLectureRoomImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file)

    const response = await axios.post(
        "/upload/getFromCloudinary",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data.url
};