import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.expo.deleteMany();

  const now = new Date();
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7));
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);

  const sampleExpos = [
    {
      title: "SETEC 웨딩박람회",
      location: "서울 강남구 남부순환로 3104 SETEC 2층",
      regionGroup: "seoul",
      regionSub: "",
      regionLabel: "서울",
      startDate: saturday,
      endDate: sunday,
      status: "open",
      linkUrl: "https://example.com/setec",
      sortOrder: 1,
    },
    {
      title: "강남 코엑스 초대형 웨덱스 웨딩페어",
      location: "서울 강남구 삼성동 159, 코엑스",
      regionGroup: "seoul",
      regionSub: "",
      regionLabel: "서울",
      startDate: saturday,
      endDate: sunday,
      status: "open",
      linkUrl: "https://example.com/coex",
      sortOrder: 2,
    },
    {
      title: "일산킨텍스 최대규모 대형 웨딩박람회",
      location: "경기 고양시 일산서구 킨텍스로 217-60 킨텍스 2전시장",
      regionGroup: "gyeonggi",
      regionSub: "",
      regionLabel: "경기",
      startDate: saturday,
      endDate: sunday,
      status: "open",
      linkUrl: "https://example.com/kintex",
      sortOrder: 3,
    },
    {
      title: "대전 위드유 웨딩박람회",
      location: "대전 서구 계룡로 598 롯데백화점 대전점 B1",
      regionGroup: "metropolitan",
      regionSub: "daejeon",
      regionLabel: "대전",
      startDate: saturday,
      endDate: sunday,
      status: "open",
      linkUrl: "https://example.com/daejeon",
      sortOrder: 4,
    },
    {
      title: "IWC 인천 웨딩박람회",
      location: "인천 남동구 예술로 206 구월중앙프라자 3층 IWC인천웨딩컴퍼니",
      regionGroup: "metropolitan",
      regionSub: "incheon",
      regionLabel: "인천",
      startDate: saturday,
      endDate: sunday,
      status: "open",
      linkUrl: "https://example.com/incheon",
      sortOrder: 5,
    },
    {
      title: "BEXCO 부산 웨딩엑스포",
      location: "부산 해운대구 APEC로 55 BEXCO",
      regionGroup: "metropolitan",
      regionSub: "busan",
      regionLabel: "부산",
      startDate: saturday,
      endDate: sunday,
      status: "open",
      linkUrl: "https://example.com/busan",
      sortOrder: 6,
    },
    {
      title: "천안 아일랜드유 위드유 웨딩박람회",
      location: "충남 천안시 서북구 부대3길 26 아일랜드유 특별행사장",
      regionGroup: "local",
      regionSub: "chungcheong",
      regionLabel: "충청",
      startDate: saturday,
      endDate: sunday,
      status: "open",
      linkUrl: "https://example.com/chungcheong",
      sortOrder: 7,
    },
  ];

  for (const expo of sampleExpos) {
    await prisma.expo.create({ data: expo });
  }

  console.log("Sample wedding expos seeded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
