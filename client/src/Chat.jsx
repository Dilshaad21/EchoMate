import { useEffect } from "react";

export default function Chat() {
  useEffect(() => {
    new WebSocket("ws://localhost:8000");
  }, []);
  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">contacts</div>
      <div className="flex flex-col bg-blue-50 w-2/3 p-2">
        <div className="flex-grow">messages with selected person</div>
        <div className="flex gap-2 ">
          <input
            type="text"
            className="bg-white flex-grow border p-2 rounded-sm"
            placeholder="Type your message here"
          />
          <button className="bg-blue-500 p-2 text-white rounded-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
