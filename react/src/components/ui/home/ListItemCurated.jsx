import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import CuratedCard from "./CuratedCard";

export default function ListItemCurated() {
  return (
    <div>
      <div className="flex items-center justify-between mt-8">
        <h1 className="text-4xl font-bold">Curated collections</h1>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded font-medium">
            View all
          </button>
        </div>
      </div>
      <Swiper slidesPerView={3.2} spaceBetween={2} className="mt-4">
        <SwiperSlide>
          <CuratedCard
            imageSrc="https://placehold.co/400x400?text=404+Image+Not+Found"
            title="404"
            author="SHLØMS"
            authorImage="https://placehold.co/100x100?text=Author+Image"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CuratedCard
            imageSrc="https://placehold.co/400x400?text=Zima+by+Nahiko"
            title="Zima by Nahiko"
            author="Nahiko"
            authorImage="https://placehold.co/100x100?text=Author+Image"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CuratedCard
            imageSrc="https://placehold.co/400x400?text=Superchain+Chiblings"
            title="Superchain Chiblings"
            author="secretpikachu.eth"
            authorImage="https://placehold.co/100x100?text=Author+Image"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CuratedCard
            imageSrc="https://placehold.co/400x400?text=Extra+Slide"
            title="Extra Slide"
            author="Extra Author"
            authorImage="https://placehold.co/100x100?text=Author+Image"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
