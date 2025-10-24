const PageClient = ({ data }) => {
  return (
    <>
      <div className="container hidden bg-white py-5 lg:block">
        <h1 className="color-portal-primaryLiving mb-7 pb-1 text-center text-3xl font-bold">
          {data?.title ?? ''}
        </h1>

        <div
          dangerouslySetInnerHTML={{
            __html: data?.description ?? '',
          }}
        />
      </div>

      <div className="container block overflow-y-auto overflow-x-hidden bg-white px-2 py-8 lg:hidden">
        <h1 className="color-portal-primaryLiving mb-7 pb-1 text-center text-3xl font-bold">
          {data?.title ?? ''}
        </h1>

        <div
          className="w-full break-words text-sm leading-relaxed text-gray-700"
          style={{
            wordBreak: 'break-word',
          }}
          dangerouslySetInnerHTML={{
            __html: data?.description ?? '',
          }}
        />
      </div>
    </>
  );
};

export default PageClient;
