import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSessionContext } from "./ContextProvider";

export default function NewPost() {
  // Step 1: Initialize state variables
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const session = useSessionContext();
  // Step 2: Handle text area content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // Step 3: Handle form submission
  const onSubmit = async (data: string) => {
    if (!session) return;
    try {
      if (data.trim() !== "") {
        setIsLoading(true);
        // Step 4: Content submission (will be replaced later)
        await session.call({
          name: "make_post",
          args: [data],
        });
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      // Step 5: Reset state and loading indicator
      setContent("");
      setIsLoading(false);
    }
  };

  // Render the component
  return (
    <div className="p-6">
      <textarea
        className="w-full p-2 border rounded"
        rows={4}
        placeholder="Write your post..."
        value={content}
        onChange={handleContentChange}
      />
      <button
        className={`${
          isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
        } w-32 hover:cursor-pointer text-white font-bold py-2 px-4 rounded float-right`}
        onClick={() => onSubmit(content)}
        disabled={isLoading}
      >
        {isLoading ? "Posting..." : "Post"}
      </button>
    </div>
  );
}
