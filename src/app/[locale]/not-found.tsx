import I404Png from '@/images/404.png';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="nc-Page404">
      <div className="container relative pb-16 pt-5 lg:pb-20 lg:pt-5">
        {/* HEADER */}
        <header className="mx-auto max-w-2xl space-y-2 text-center">
          <Image src={I404Png} alt="not-found" />
          <span className="block text-sm font-medium tracking-wider text-neutral-800 dark:text-neutral-200 sm:text-base">
            Hình như bạn lạc đường rồi! Trang này không tồn tại. Hãy quay lại trang chủ nhé!
          </span>
          <div className="pt-8">
            <a
              href="/"
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Quay về trang chủ
            </a>
          </div>
        </header>
      </div>
    </div>
  );
}
