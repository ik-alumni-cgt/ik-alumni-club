import { getSchedules } from "@/data/schedule";
import { ContentsHeader } from "../contents/contents-header";
import { ScheduleContentsCard } from "./card";
import Link from "next/link";

export async function ScheduleContents() {
  const schedules = await getSchedules();
  const items = schedules.slice(0, 3);

  return (
    <div className="flex flex-col">
      <div className="text-white">
        <ContentsHeader title="SCHEDULE" viewAllHref="/schedule" />
      </div>
      <div className="flex flex-col gap-[30px] mt-[60px]">
        {items.length === 0 ? (
          <p className="text-white">配信までしばらくお待ちください</p>
        ) : (
          items.map((schedule) => {
            const dateObj = new Date(schedule.eventDate);
            const year = String(dateObj.getFullYear());
            const month = String(dateObj.getMonth() + 1).padStart(2, "0");
            const day = String(dateObj.getDate()).padStart(2, "0");
            const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const weekDay = weekDays[dateObj.getDay()];

            return (
              <Link key={schedule.id} href={`/schedule/${schedule.id}`}>
                <ScheduleContentsCard
                  title={schedule.title}
                  year={year}
                  month={month}
                  day={day}
                  weekDay={weekDay}
                />
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
