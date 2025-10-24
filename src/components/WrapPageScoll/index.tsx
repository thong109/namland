import * as React from 'react';
export interface IDataTableProps {
  renderActions?: any;
  children: React.ReactNode;
  notShowDesktop?: boolean;
}

const WrapPageScroll: React.FunctionComponent<IDataTableProps> = ({
  renderActions,
  notShowDesktop = false,
  ...props
}) => {
  return (
    <div>
      <div className="mb-[150px] lg:mb-[60px]">{props.children}</div>
      <div className="sticky bottom-2 z-[39] w-full px-7">
        {renderActions && (
          <div
            className={`rounded-2xl bg-transparent p-2 lg:border lg:bg-white lg:opacity-[0.85] ${
              notShowDesktop ? 'block lg:hidden' : 'block'
            }`}
          >
            {renderActions && renderActions()}
          </div>
        )}
      </div>
    </div>
  );
};

export default WrapPageScroll;
