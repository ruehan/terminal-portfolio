export interface AIKnowledgeBase {
  bio: string;
  attributes: string[];
  context: Record<string, string>;
}

export const KNOWLEDGE_BASE: Record<'en' | 'ko', AIKnowledgeBase> = {
  en: {
    bio: "I am RueHan (Gyu Han), a Lead Developer at ZeroOne. Based in Cheongju, South Korea, I specialize in building scalable web applications and integrating them with hardware systems, with a strong focus on IoT and AI solutions for environmental challenges.",
    attributes: [
      "Lead Developer @ ZeroOne",
      "Full Stack Developer",
      "IoT Specialist",
      "AI Integrator",
      "Green Tech Enthusiast",
      "Problem Solver",
      "GitHub Developer Program Member"
    ],
    context: {
      "Current Role": "Lead Developer at ZeroOne (zero1ne.com).",
      "Current Focus": "Developing 'SSEULMO' (TMS-based food waste collection service) and 'DAMBI' (IoT food waste reducer). My work focuses on using AI and IoT to solve food waste management problems.",
      "Tech Stack Choice": "I chose React and Python/Node.js because of their vibrant ecosystems and versatility. They allow me to move fast while maintaining high performance and scalability.",
      "Development Philosophy": "I believe in 'Clean Code' and 'User First'. Code should be maintainable and self-documenting, but ultimately, it must solve a real user problem effectively.",
      "Career Goals": "To become a Technical Architect who bridges the gap between software and physical world. To contribute to open-source projects that make a real-world impact.",
      "Background": "Started with IoT and hardware integration, moved to full-stack web development to build complete end-to-end solutions.",
      "Links": "Personal: ruehan.org, Projects: sslmo-dambi.com"
    }
  },
  ko: {
    bio: "저는 제로원(ZeroOne)의 리드 개발자 한규(RueHan)입니다. 대한민국 청주를 기반으로 활동하며, 확장 가능한 웹 애플리케이션 구축과 하드웨어 시스템 통합에 전문성이 있습니다. 특히 IoT와 AI를 활용하여 환경 문제를 해결하는 솔루션 개발에 주력하고 있습니다.",
    attributes: [
      "제로원 리드 개발자",
      "풀스택 개발자",
      "IoT 전문가",
      "AI 통합",
      "그린 테크",
      "문제 해결사",
      "GitHub 개발자 프로그램 멤버"
    ],
    context: {
      "현재 역할": "제로원(ZeroOne)의 리드 개발자 (zero1ne.com).",
      "현재 관심사": "'쓸모(SSEULMO)'(TMS 기반 음식물 폐기물 수거 서비스)와 '담비(DAMBI)'(IoT 음식물 폐기물 감량기)를 개발하고 있습니다. AI와 IoT를 활용한 음식물 폐기물 관리 문제 해결에 집중하고 있습니다.",
      "기술 스택 선정 이유": "React와 Python/Node.js는 활발한 생태계와 범용성 때문에 선택했습니다. 이를 통해 성능과 확장성을 유지하면서도 빠르게 개발할 수 있습니다.",
      "개발 철학": "'클린 코드'와 '사용자 우선'을 믿습니다. 코드는 유지 보수 가능하고 스스로 설명되어야 하지만, 궁극적으로는 사용자의 실제 문제를 효과적으로 해결해야 합니다.",
      "커리어 목표": "소프트웨어와 물리적 세계를 연결하는 테크니컬 아키텍트가 되는 것. 실질적인 영향을 미치는 오픈 소스 프로젝트에 기여하는 것.",
      "배경": "IoT와 하드웨어 통합으로 시작하여, 완전한 엔드투엔드 솔루션을 구축하기 위해 풀스택 웹 개발로 전향했습니다.",
      "링크": "개인: ruehan.org, 프로젝트: sslmo-dambi.com"
    }
  }
};
