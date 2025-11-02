"use client";
import React, { useState, useEffect } from "react";
import { Pagination, Spin } from "antd";
import { postEcomEcomProjectGetListProject } from "@/ecom-sadec-api-client/services.gen";
import ProjectCardItem from "../../_components/projectCardItem";

const RecentPropertiesClient: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const pageSize = 3;

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await postEcomEcomProjectGetListProject({
        requestBody: { from: (page - 1) * pageSize, size: pageSize },
      });
      setData((response as any).data?.data || []);
      setTotal((response as any).data?.total || 0);
    } finally {
      // delay nhẹ để mượt hơn
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  return (
    <>
      <div className="relative">
        <div
          className={`grid grid-cols-12 gap-4 md:gap-[30px] transition-opacity duration-200`}
        >
          {data.map((item, idx) => (
            <div key={idx} className="col-span-12 sm:col-span-6 lg:col-span-4">
              <ProjectCardItem data={item} />
            </div>
          ))}
        </div>

        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white/30 rounded-lg">
            <Spin />
          </div>
        )}

      </div>
      <div className="pagination-common mt-8 md:mt-[38px] text-center">
        <Pagination
          current={currentPage}
          total={total}
          pageSize={pageSize}
          showSizeChanger={false}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  );
};

export default RecentPropertiesClient;
