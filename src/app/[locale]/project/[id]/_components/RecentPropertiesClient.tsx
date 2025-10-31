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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  return (
    <div className="mt-8">
      {loading ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 md:gap-[30px]">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="col-span-12 sm:col-span-6 lg:col-span-4"
            >
              <ProjectCardItem data={item} />
            </div>
          ))}
        </div>
      )}

      <div className="pagination-common mt-8 md:mt-[38px] text-center">
        <Pagination
          current={currentPage}
          total={total}
          pageSize={pageSize}
          showSizeChanger={false}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default RecentPropertiesClient;
