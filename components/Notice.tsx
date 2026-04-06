export default function Notice() {
  return (
    <div className="mx-[25px] mt-[16px] mb-[30px] bg-[#F0FAF7] rounded-[14px] px-[18px] py-[14px]">
      <p className="text-[13px] font-semibold text-[#02AB87] mb-[6px]">
        📌 안내사항
      </p>
      <ul className="flex flex-col gap-[4px]">
        <li className="text-[12px] text-[#747474] font-medium before:content-['•'] before:mr-[6px]">
          미탑승 시에는 사전에 신청해주세요.
        </li>
        <li className="text-[12px] text-[#747474] font-medium before:content-['•'] before:mr-[6px]">
          체크는 1회만 가능하며, 수정할 수 없습니다.
        </li>
      </ul>
    </div>
  );
}
