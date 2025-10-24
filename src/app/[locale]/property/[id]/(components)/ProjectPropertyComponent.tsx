'use-client';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
const ProjectPropertyComponent = ({ data }: any) => {
  const router = useRouter();
  const t = useTranslations('webLabel');
  const clickToProject = (id) => {
    router.push(`/du-an/${id}`);
  };
  return (
    <>
      <div className="project-component hidden lg:block">
        <div className="rouded relative flex w-full flex-col rounded border bg-white p-[10px] shadow-sm lg:h-[300px] lg:flex-row lg:p-[35px]">
          <img
            className="object-fill lg:h-[235px] lg:w-[235px]"
            alt=""
            src={data?.imageUrl || null}
          />
          <div className="flex flex-col items-start justify-start pl-[35px]">
            <h1 className="text-[25px] font-bold text-portal-blackGray">{data?.name}</h1>
            <div className="mb-[25px] overflow-hidden text-ellipsis pt-[15px] text-[14px]">
              <p dangerouslySetInnerHTML={{ __html: data?.descriptions }}></p>
            </div>
            <div
              onClick={() => {
                clickToProject(data?.id);
              }}
              className="text--portal-primaryLiving absolute bottom-5 right-5 z-10 cursor-pointer underline"
            >
              {t('EcomPropertyDetailPageProjectViewMore')}
            </div>
          </div>
        </div>
      </div>
      <div className="project-component block lg:hidden">
        <div className="rouded relative flex w-full flex-col items-center justify-center rounded border bg-white p-[10px] shadow-sm lg:p-[35px]">
          <img className="h-[250px] w-full" alt="" src={data?.imageUrl || null} />
          <div className="flex flex-col">
            <h1 className="my-[17px] text-center text-[25px] font-bold text-portal-blackGray">
              {data?.name}
            </h1>
            <div className="mb-[30px] max-h-[300px] overflow-hidden text-ellipsis pt-[15px] text-[14px]">
              <p dangerouslySetInnerHTML={{ __html: data?.descriptions }}></p>
            </div>
            <div
              onClick={() => {
                clickToProject(data?.id);
              }}
              className="text--portal-primaryLiving absolute bottom-2 right-5 z-10 cursor-pointer text-[18px] underline"
            >
              {t('EcomPropertyDetailPageProjectViewMore')}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectPropertyComponent;
