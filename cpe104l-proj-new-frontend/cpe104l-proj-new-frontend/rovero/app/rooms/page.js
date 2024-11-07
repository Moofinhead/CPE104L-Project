import Breadcrumb from "@/components/Breadcrumb";
import RoveroLayout from "@/layouts/RoveroLayout";
import RoomPreview from '@/components/RoomPreview';

const RoomsPage = () => {
  return (
    <RoveroLayout>
      <Breadcrumb
        pageName="Rooms"
        bgImage="/images/room/rooms-breadcrumb.jpg"
        pageTitle="Rooms"
        pageSubTitle="Find the Room that Best Suits You"
      /> {/* end breadcrumb */}
      <RoomPreview /> {/* end room preview */}
    </RoveroLayout>
  );
};

export default RoomsPage;
