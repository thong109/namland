import { Alert, Col, Drawer, Row } from 'antd';
import Button from 'antd/lib/button';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import './index.scss';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const SortDrawerImage = ({ visible, data, handleSave, setVisibleDrawer }) => {
  const [sortItems, setSortItems] = useState(data || []);

  const t = useTranslations('webLabel');

  useEffect(() => {
    if (data) {
      setSortItems(data);
    }
  }, [data]);

  const onDragEnd = async ({ source: src, destination: des }: DropResult) => {
    if (!des || src.droppableId !== des.droppableId) return;

    setSortItems(reorder(sortItems, src.index, des.index));
  };

  const onSave = async () => {
    const data = sortItems.map((item) => item.id);
    await handleSave(data);
    setVisibleDrawer();
  };

  return (
    <Drawer
      title={t('DRAWER_SORT_TITLE')}
      width={270}
      onClose={() => setVisibleDrawer(false)}
      open={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div className="text-right">
          <Button onClick={() => setVisibleDrawer(false)} className="mr-1">
            {t('goBack')}
          </Button>
          <Button
            className="!bg-portal-primaryLiving !text-white drop-shadow hover:bg-portal-primaryLiving hover:text-white"
            onClick={() => onSave()}
            type="primary"
          >
            {t('save')}
          </Button>
        </div>
      }
    >
      <Row gutter={[16, 8]}>
        <Col sm={{ span: 24, offset: 0 }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Alert message={t('DRAG_DROP_TO_REARRANGE_ORDER_MESSAGE')} type="info" />
            <div className="d-flex mt-3">
              <Droppable droppableId="sortItem" direction="vertical">
                {(providedSortItems) => (
                  <div
                    style={{ flex: '0 1 100%', width: '156px' }}
                    ref={providedSortItems.innerRef}
                  >
                    {(sortItems || []).map((item: any, inx) => (
                      <Draggable key={`f-drag-${item.id}`} draggableId={`f-${item.id}`} index={inx}>
                        {(dragProvided) => (
                          <img
                            style={{ height: '136px', width: '156px' }}
                            className="sort-item mb-2 mr-1"
                            src={item.imageUrl}
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    ))}
                    {providedSortItems.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        </Col>
      </Row>
    </Drawer>
  );
};

export default SortDrawerImage;
