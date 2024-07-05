import dayjs from "dayjs";
import "dayjs/locale/id";

const ddate = (date?: string | number | Date | dayjs.Dayjs | null) => {
  return dayjs(date, { locale: "id" });
};

export default ddate;
