import { useTranslations } from 'next-intl';
import { FC } from 'react';

const PagePolicy: FC = () => {
  const t = useTranslations('webLabel');
  return (
    <div className={`nc-PageSignUp`}>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center justify-center text-2xl font-semibold leading-[115%] text-portal-primaryLiving dark:text-neutral-100 md:text-5xl md:leading-[115%]">
          Chính sách Cookie
        </h2>
        <div>
          <div>
            <div className="mt-2">
              Khi người dùng truy cập trang web của chúng tôi, “cookie” được sử dụng để hỗ trợ người
              dùng sử dụng trang web. Cookie là các đơn vị dữ liệu nhỏ được lưu trữ tạm thời trên
              đĩa cứng của máy tính của người dùng bởi trình duyệt cần thiết để sử dụng trang web
              của chúng tôi. Cookie cho phép trang web lưu trữ mã định danh duy nhất (là mã ẩn danh)
              trong trình duyệt của người dùng khi đang truy cập trang web. Sau đó, cookie được gửi
              trở lại trang web ban đầu trong mỗi lần truy cập tiếp theo, hoặc đến một trang web
              khác nhận ra cookie đó. Cookie thực hiện nhiều công việc khác nhau và hữu ích để giúp
              trang web hoạt động, hoặc hoạt động hiệu quả hơn, nhìn chung là cải thiện trải nghiệm
              trực tuyến của người dùng và giúp chúng tôi cung cấp cho người dùng sản phẩm và dịch
              vụ tốt nhất.
            </div>
          </div>
        </div>
        <div className="">
          <div className="mt-4">
            <div className="text-lg font-bold">CÓ HAI LOẠI COOKIE:</div>
            <div className="text-lg font-bold">COOKIE CỦA BÊN THỨ NHẤT</div>
            <div className="mt-2 pl-4">
              Cookie của bên thứ nhất được đặt bởi trang web người dùng đang truy cập và chúng chỉ
              có thể được đọc bởi trang web đó.
            </div>
            <div className="text-lg font-bold">COOKIE CỦA BÊN THỨ BA </div>
            <div className="mt-2 pl-4">
              Cookie của bên thứ ba được đặt bởi các tổ chức khác mà chúng tôi sử dụng cho các dịch
              vụ khác nhau. Ví dụ: chúng tôi sử dụng các dịch vụ phân tích bên ngoài và các nhà cung
              cấp này thay mặt chúng tôi đặt cookie để báo cáo những thông tin đang phổ biến và
              những thông tin không phổ biến. Trang web người dùng đang truy cập cũng có thể chứa
              nội dung được gắn vào, ví dụ: YouTube và các trang web này có thể đặt cookie của riêng
              họ.
            </div>
          </div>
        </div>

        <div className="">
          <div className="mt-4">
            <div className="text-lg font-bold">TẠI SAO TÔI NÊN CHO PHÉP COOKIE?</div>
            <div className="mt-2">
              Thông tin có trong cookie được sử dụng để cải thiện dịch vụ cho người dùng, ví dụ:
            </div>
            <li>
              cho phép một dịch vụ nhận ra thiết bị của người dùng mỗi lần người dùng truy cập trang
              web để người dùng không phải cung cấp thông tin tương tự nhiều lần trong một nhiệm vụ,
              ví dụ: điền vào mẫu web hoặc khảo sát web;
            </li>
            <li>
              tiến hành tìm kiếm và phân tích thống kê để giúp cải thiện nội dung, sản phẩm và dịch
              vụ của chúng tôi và để giúp chúng tôi hiểu rõ hơn về các yêu cầu và mối quan tâm của
              khách truy cập/khách hàng để hỗ trợ công cụ tìm sản phẩm;
            </li>
            <li>cho phép trình phát video hoạt động phù hợp;</li>
            <li>
              tính xem có bao nhiêu người đang sử dụng dịch vụ và khả năng của trình duyệt, để dịch
              vụ có thể được sử dụng dễ dàng hơn và có đủ khả năng để đảm bảo sự nhanh chóng; phân
              tích dữ liệu ẩn danh để giúp chúng tôi hiểu cách mọi người tương tác với các khía cạnh
              khác nhau của các dịch vụ trực tuyến của chúng tôi để chúng tôi có thể thực hiện dịch
              vụ tốt hơn.
            </li>
          </div>
        </div>

        <div className="">
          <div className="mt-4">
            <div className="text-lg font-bold">NẾU TÔI TỪ CHỐI THÌ SAO?</div>
            <div className="mt-2">
              Xin lưu ý rằng việc hạn chế cookie có thể ảnh hưởng đến chức năng của trang web của
              chúng tôi. Nếu người dùng quyết định chặn cookie, điều này có thể khiến một số tính
              năng nhất định của trang web này không còn hoạt động một cách bình thường. Điều này sẽ
              hạn chế một số tính năng trên trang web của chúng tôi.
            </div>
            <li>Tìm kiếm sản phẩm</li>
            <li>Tìm kiếm mô tả kỹ thuật</li>
            <li>Xem video</li>
            <li>Thích và chia sẻ trang này trên các mạng xã hội</li>
            <div className="mt-2">
              Nếu người dùng sử dụng cài đặt trình duyệt của mình để từ chối hoặc chặn cookie, người
              dùng có thể không truy cập được tất cả hoặc một phần trang web hoặc không thể sử dụng
              toàn bộ chức năng của trang web của chúng tôi.
            </div>
          </div>
        </div>

        <div className="">
          <div className="mt-4">
            <div className="text-lg font-bold">COOKIE ĐƯỢC SỬ DỤNG TRÊN TRANG WEB NÀY:</div>
            <div className="mt-2">Trang web của chúng tôi sử dụng bốn loại cookie chính:</div>
            <li className="py-2 font-bold">Cookie cần thiết nghiêm ngặt:</li>
            <div className="pl-4">
              Những cookie này rất cần thiết cho hoạt động của trang web. Không thể sử dụng các phần
              thiết yếu của trang web nếu không có chúng. Theo đó, các cookie này luôn được kích
              hoạt. Chúng cũng được sử dụng để truy cập hiển thị trang web được tối ưu hóa cho thiết
              bị di động, chẳng hạn như dung lượng dữ liệu của người dùng không bị sử dụng hết một
              cách không cần thiết.
            </div>

            <li className="py-2 font-bold">Cookie chức năng:</li>
            <div className="pl-4">
              Cookie chức năng cho phép chúng tôi nâng cao trải nghiệm của người dùng bằng cách cho
              phép trang web lưu trữ thông tin như tên người dùng hoặc bất kỳ cài đặt nào người dùng
              có thể đã chọn và cung cấp cho người dùng các chức năng được cải thiện và cá nhân hóa
              dựa trên thông tin này. Thông tin thu thập được chỉ được đánh giá ở dạng tổng hợp.
              Cookie chức năng cũng được sử dụng để kích hoạt các chức năng mà người dùng mong muốn,
              chẳng hạn như phát lại video.
            </div>

            <li className="py-2 font-bold">Cookie hiệu suất:</li>
            <div className="pl-4">
              Những cookie này thu thập dữ liệu về hành vi của người dùng để đo lường hiệu suất của
              trang web. Trên cơ sở này, trang web được điều chỉnh theo hành vi chung của người dùng
              về nội dung và chức năng. Do đó, cookie hiệu suất cho phép cải thiện hiệu suất của
              trang web và điều chỉnh trải nghiệm trực tuyến theo nhu cầu của người dùng. Khi sử
              dụng cookie hiệu suất, chúng tôi không lưu trữ bất kỳ dữ liệu cá nhân nào và chỉ sử
              dụng thông tin được thu thập thông qua các cookie này ở dạng tổng hợp và ẩn danh.
            </div>

            <li className="py-2 font-bold">Cookies nhắm mục tiêu:</li>
            <div className="pl-4">
              Cookie tiếp thị được sử dụng để theo dõi hoạt động và từng phiên truy cập của người
              dùng, từ đó chúng tôi có thể cung cấp các nội dung phù hợp hơn cho người dùng và điều
              chỉnh theo sở thích của họ. Chúng cũng được sử dụng trong việc đánh giá và quản lý
              hiệu quả của chiến dịch. Tuy nhiên, Người dùng sẽ không nhìn thấy hoặc nhận được ít
              nội dung hơn nếu rút lại sự đồng ý của người dùng đối với cookie tiếp thị. Điều này có
              nghĩa là thông tin người dùng nhìn thấy và nhận được không được cá nhân hóa.
            </div>
          </div>
        </div>

        <div className="">
          <div className="mt-4">
            <div className="text-lg font-bold">LÀM THẾ NÀO ĐỂ KIỂM SOÁT HOẶC XÓA COOKIE?</div>
            <div className="mt-2">
              Hầu hết các trình duyệt web ban đầu được định cấu hình để tự động chấp nhận cookie.
              Người dùng có thể sửa đổi cài đặt trình duyệt của mình để được cảnh báo trước khi đặt
              cookie cụ thể nếu người dùng không muốn trang web của chúng tôi cài đặt cookie trên
              thiết bị của người dùng. Ngoài ra, người dùng có thể thay đổi cài đặt trình duyệt của
              mình để chỉ chấp nhận một số cookie của chúng tôi hoặc từ chối tất cả cookie từ bên
              thứ ba. Bằng cách xóa các cookie đã được lưu trữ, người dùng cũng có thể rút lại sự
              đồng ý của mình về việc sử dụng chúng.
            </div>
            <div className="mt-2">
              Người dùng phải đảm bảo rằng mỗi trình duyệt trên mỗi thiết bị được định cấu hình để
              phù hợp với tùy chọn cookie của người dùng nếu người dùng truy cập trang web của chúng
              tôi từ nhiều thiết bị (chẳng hạn như máy tính, điện thoại thông minh hoặc máy tính
              bảng).
            </div>
            <div className="mt-2">
              Các bên thứ ba chịu trách nhiệm về cookie mà họ cài đặt trên trang web của chúng tôi
              và chúng tôi không có quyền truy cập hoặc kiểm soát cookie hoặc các tính năng khác mà
              các bên thứ ba này có thể sử dụng. Các thông lệ về thông tin của các bên thứ ba này
              không nằm trong Chính sách Cookie này. Để từ chối việc các bên thứ ba thu thập bất kỳ
              dữ liệu nào về tương tác của người dùng trên trang web của chúng tôi, vui lòng tham
              khảo trang web của họ để biết thêm thông tin.
            </div>
            <div className="mt-2">
              Sử dụng nút bên dưới để chuyển đổi giữa việc cho phép hoặc không cho phép cookie do
              trang web này cài đặt.
            </div>
            <div className="mt-2">
              Các cookie trong Chính sách Cookie sẽ vẫn còn vì nó được yêu cầu ghi nhớ lựa chọn của
              người dùng.
            </div>
          </div>
        </div>

        <div className="">
          <div className="mt-4">
            <div className="text-lg font-bold">THỜI HẠN COOKIE</div>
            <div className="mt-2">
              Mỗi loại cookie có thời hạn riêng dựa trên chức năng của chúng, thông thường như sau:
            </div>
            <li>
              Phiên Cookie. Những cookie này là cookie tạm thời vẫn còn trên thiết bị của người dùng
              cho đến khi người dùng rời khỏi trang web của chúng tôi; hoặc
            </li>
            <li>
              Cookie Liên Tục. Những cookie này sẽ tồn tại trên thiết bị của người dùng lâu hơn nữa
              hoặc cho đến khi người dùng xóa chúng theo cách thủ công (thời gian cookie tồn tại
              trên thiết bị của người dùng sẽ phụ thuộc vào thời lượng hoặc “tuổi thọ” của cookie cụ
              thể, cũng như cài đặt trình duyệt của người dùng, như được nêu bên dưới).
            </li>
          </div>
        </div>

        <div className="">
          <div className="mt-4">
            <div className="text-lg font-bold">THAY ĐỔI CHÍNH SÁCH COOKIE</div>
            <div className="mt-2">
              Chúng tôi có thể sửa đổi Chính sách Cookie này để phản ánh những thay đổi đối với
              thông lệ và dịch vụ của chúng tôi. Mọi thay đổi đối với Chính sách Cookie này sẽ được
              công bố trên trang này. Khi chúng tôi đăng các thay đổi đối với Chính sách Cookie,
              chúng tôi sẽ sửa lại ngày “Cập nhật lần cuối” ở đầu Chính sách Cookie này. Điều này
              cho phép người dùng tự tìm hiểu bất cứ lúc nào về cách chúng tôi thu thập, sử dụng
              và/hoặc chia sẻ thông tin được lưu giữ trong cookie. Chúng tôi khuyến nghị người dùng
              nên thỉnh thoảng kiểm tra trang này để tự tìm hiểu về bất kỳ thay đổi nào trong Chính
              sách Cookie này hoặc bất kỳ chính sách nào khác của chúng tôi.
            </div>
          </div>
        </div>

        <div className="">
          <div className="mt-4">
            <div className="mt-2">
              Bằng cách gửi dữ liệu cho chúng tôi, người dùng đồng ý rằng tất cả dữ liệu cá nhân của
              người dùng mà chúng tôi thu thập được có thể được chúng tôi xử lý theo cách thức và
              cho các mục đích được mô tả trong chính sách bảo vệ dữ liệu cá nhân dưới đây:
              <a href="/dieu-khoan-dieu-kien" className="ml-1 font-semibold">
                CHÍNH SÁCH BẢO VỆ DỮ LIỆU CÁ NHÂN
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagePolicy;
