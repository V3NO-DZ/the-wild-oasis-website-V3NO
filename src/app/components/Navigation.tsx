import Link from "next/link";
import { authConfig } from "../lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";

export default async function Navigation() {
  const session = await getServerSession(authConfig);

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-colors"
          >
            Cabins
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>
        <li>
          {session?.user?.image ? (
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors flex gap-4 items-center"
            >
              <Image
                className="h-8 w-8 rounded-full"
                width={32}
                height={32}
                referrerPolicy="no-referrer"
                alt={session.user.name || 'User avatar'}
                src={session.user.image}
              />
              <span>Guest area</span>
            </Link>
          ) : (
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors"
            >
              Guest area
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
