import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="py-2 px-6">
      <ul className="flex justify-between">
        <li>
          <Link href="/" className="text-xl font-extrabold">
            News feed dapp
          </Link>
        </li>
        <div className="flex gap-4 font-semibold">
          <li>
            <Link href="/new-post" className="hover:text-gray-600">
              New Post
            </Link>
          </li>
          <li>
            <Link href="/users" className="hover:text-gray-600">
              Users
            </Link>
          </li>
          <li>
            <Link href="/" className="hover:text-gray-600">
              Feed
            </Link>
          </li>
        </div>
      </ul>
    </nav>
  );
}
