import { Project } from './types';

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

interface Education {
  degree: string;
  school: string;
  period: string;
}



interface Translation {
  PROJECTS: Project[];
  HELP_TEXT: string;
  ABOUT_TEXT: string;
  CONTACT_TEXT: string;
  WELCOME: string;
  PROFILE: {
    avatarUrl: string;
    name: string;
    bioDetail: string;
    experience: Experience[];
    education: Education[];
    skillsTitle: string;
    skills: string[];
    expTitle: string;
    eduTitle: string;

  };
  UI: {
    start_demo: string;
    email: string;
    github: string;
    linkedin: string;
    class: string;
    level: string;
    processing: string;
    system_error: string;
    searching: string;
    input_placeholder: string;
    ai_input_placeholder: string;
    system_name: string;
    user_prefix: string;
    ai_prefix: string;
    ai_mode_welcome: string;
    ai_mode_exit: string;
    command_not_found: string;
    sudo_message: string;
    matrix_message: string;
    konami_message: string;
    tips: string[];
    status: {
        cpu: string;
        mem: string;
        net: string;
        uptime: string;
    };
    commands: {
        help: string;
        about: string;
        projects: string;
        contact: string;
        clear: string;
        tip: string;
    };
    modal: {
        features: string;
        close: string;
        launch: string;
    }
  };
}

export const TRANSLATIONS: Record<'en' | 'ko', Translation> = {
  en: {
    PROJECTS: [
      {
        id: 'p1',
        name: 'SSEULMO',
        description: 'TMS-based food waste collection service.',
        techStack: ['FastAPI', 'React', 'AI'],
        status: 'Active',
        features: [
            'Photo-based volume measurement',
            'AI waste analysis technology',
            'Smart collection optimization'
        ]
      },
      {
        id: 'p2',
        name: 'DAMBI',
        description: 'IoT food waste reducer.',
        techStack: ['IoT', 'Real-time Monitoring', 'Energy Efficiency'],
        status: 'Active',
        features: [
            'Eco-friendly waste processing',
            'Real-time monitoring',
            'Energy efficiency optimization'
        ]
      },
      {
        id: 'p3',
        name: 'Calmiary',
        description: 'Time to record myself - Worry recording diary.',
        techStack: ['React', 'TypeScript'],
        status: 'Archived',
        features: [
            'Record worries',
            'Customized advice',
            'Diary',
            'Community'
        ]
      },
      {
        id: 'p4',
        name: 'DDang',
        description: 'Dog walking social platform.',
        techStack: ['React', 'TypeScript', 'Vite'],
        status: 'Archived',
        features: [
            'Walk recording',
            'Dog meeting request',
            'Real-time chat',
            'Dog friends'
        ]
      }
    ],
    HELP_TEXT: `
AVAILABLE COMMANDS:
-------------------
help        : Show this help message
about       : About
projects    : Projects
contact     : Contact
clear / cls : Clear terminal
tip         : Show a random tip
ai          : Ask AI Assistant (e.g., "ai What is your stack?")

TIP: Click suggestions below or type commands directly.
`,
    ABOUT_TEXT: `
IDENTITY: Ruehan (Full Stack Developer)
LOCATION: Cheongju, Korea
MISSION : Building Tomorrow's Tech.

SKILLS:
> Frontend: React, Next.js, Remix, Vue
> Backend : Python (FastAPI, Flask), Node.js, Java
> Mobile  : React Native, Android Studio
> DevOps  : Docker, K8s, Git, Linux
`,
    PROFILE: {
      avatarUrl: "https://github.com/ruehan.png",
      name: "RueHan (Gyu Han)",
      bioDetail: "I am a Full Stack Developer transforming waste into resources and building AI-powered solutions. With experience in IoT, AI, and web architecture, I bridge the gap between hardware and software.",
      skillsTitle: "SKILL MATRIX",
      skills: ['React', 'Next.js', 'Remix', 'Vue', 'HTML', 'CSS', 'JS', 'TS', 'Python', 'FastAPI', 'Flask', 'Node.js', 'Java', 'React Native', 'Android Studio', 'MySQL', 'PostgreSQL', 'MongoDB', 'Docker', 'K8s', 'Git', 'GitHub', 'VSCode', 'Linux'],
      expTitle: "EXPERIENCE LOG",
      eduTitle: "EDUCATION DATA",
      experience: [
        {
          role: "S/W Lead Developer",
          company: "ZeroOne",
          period: "2025.04 - Present",
          description: "Leading software development using FastAPI, React, and React Native."
        },
        {
          role: "Skill Enhancement",
          company: "Career Transition",
          period: "2023.03 - 2025.04",
          description: "Focused on learning and growing, acquiring new tech stacks."
        },
        {
          role: "Software Researcher",
          company: "KETI",
          period: "2021.10 - 2023.03",
          description: "Researched and developed software using Flask, Python, and Vue.js."
        }
      ],
      education: [
        {
          degree: "Computer Science",
          school: "University",
          period: "2014 - 2018"
        }
      ],

    },
    CONTACT_TEXT: `
COMMUNICATION CHANNELS OPEN:
----------------------------
> Blog     : ruehan.org
> Portfolio: interactive-portfolio-chi.vercel.app
> GitHub   : github.com/ruehan
`,
    WELCOME: "WELCOME TO RUEHAN'S PORTFOLI. \nType 'help' for available commands.",
    UI: {
      start_demo: "DETAILS",
      email: "EMAIL",
      github: "GITHUB",
      linkedin: "LINKEDIN",
      class: "CLASS: Full Stack",
      level: "LEVEL: 28",
      processing: "Processing...",
      system_error: "System Failure: Unable to reach AI Core.",
      searching: "Searching neural network...",
      input_placeholder: "Enter command...",
      ai_input_placeholder: "Ask AI...",
      system_name: "[SYSTEM]",
      user_prefix: "guest@ruehan:~$",
      ai_prefix: "AI@assistant:~$",
      ai_mode_welcome: "ENTERING AI INTERACTIVE MODE. Type 'exit' to return.",
      ai_mode_exit: "EXITING AI MODE.",
      command_not_found: "Command not found: ",
      sudo_message: "Permission denied: You are not the owner of this portfolio.",
      matrix_message: "Toggling Matrix visual interface...",
      konami_message: "CHEAT CODE ACTIVATED: GOD MODE ENABLED (Just kidding, but nice memory!)",
      tips: [
        "Tip: Try typing 'matrix' to see what happens.",
        "Tip: There might be a 'sudo' command for admins...",
        "Tip: Do you remember the Konami Code?",
        "Tip: 'ai' command lets you talk to the neural network."
      ],
      status: {
        cpu: "CPU",
        mem: "MEM",
        net: "NET",
        uptime: "UPTIME"
      },
      commands: {
        help: "help",
        about: "about",
        projects: "projects",
        contact: "contact",
        clear: "clear",
        tip: "tip"
      },
      modal: {
        features: "KEY FEATURES",
        close: "CLOSE WINDOW",
        launch: "LAUNCH SYSTEM"
      }
    }
  },
  ko: {
    PROJECTS: [
      {
        id: 'p1',
        name: '쓸모 (SSEULMO)',
        description: 'TMS 기반 음식물 폐기물 수거 서비스.',
        techStack: ['FastAPI', 'React', 'AI'],
        status: '서비스 중',
        features: [
            '사진 기반 용량 측정',
            'AI 폐기물 분석 기술',
            '스마트 수거 최적화'
        ]
      },
      {
        id: 'p2',
        name: '담비 (DAMBI)',
        description: 'IoT 음식물 폐기물 감량기.',
        techStack: ['IoT', '실시간 모니터링', '에너지 효율'],
        status: '서비스 중',
        features: [
            '친환경 폐기물 처리',
            '실시간 모니터링',
            '에너지 효율 최적화'
        ]
      },
      {
        id: 'p3',
        name: 'Calmiary',
        description: '나를 기록하는 시간 - 고민 기록 다이어리.',
        techStack: ['React', 'TypeScript'],
        status: '보관됨',
        features: [
            '고민 기록',
            '맞춤형 조언',
            '다이어리',
            '커뮤니티'
        ]
      },
      {
        id: 'p4',
        name: 'DDang',
        description: '반려견 산책 소셜 플랫폼.',
        techStack: ['React', 'TypeScript', 'Vite'],
        status: '보관됨',
        features: [
            '산책 기록',
            '강번따 (산책 친구 요청)',
            '실시간 채팅',
            '댕친구'
        ]
      }
    ],
    HELP_TEXT: `
사용 가능한 명령어:
-------------------
help        : 도움말 메시지 표시
about       : 소개
projects    : 프로젝트
contact     : 연락처
clear / cls : 터미널 화면 초기화
tip         : 랜덤 팁 보기
ai          : AI 어시스턴트에게 질문 (예: "ai 주로 쓰는 기술 스택이 뭐야?")

TIP: 하단의 추천 버튼을 클릭하거나 명령어를 직접 입력하세요.
`,
    ABOUT_TEXT: `
신원: Ruehan (풀스택 개발자)
위치: 대한민국 청주
임무: 미래의 기술을 구축합니다 (Building Tomorrow's Tech).

기술 스택:
> 프론트엔드 : React, Next.js, Remix, Vue
> 백엔드    : Python (FastAPI, Flask), Node.js, Java
> 모바일    : React Native, Android Studio
> 데브옵스  : Docker, K8s, Git, Linux
`,
    PROFILE: {
      avatarUrl: "https://github.com/ruehan.png",
      name: "RueHan (한규)",
      bioDetail: "폐기물을 자원으로 바꾸고 AI 기반 솔루션을 개발하는 풀스택 개발자입니다. IoT, AI, 웹 아키텍처 경험을 바탕으로 하드웨어와 소프트웨어의 경계를 잇습니다.",
      skillsTitle: "보유 기술",
      skills: ['React', 'Next.js', 'Remix', 'Vue', 'HTML', 'CSS', 'JS', 'TS', 'Python', 'FastAPI', 'Flask', 'Node.js', 'Java', 'React Native', 'Android Studio', 'MySQL', 'PostgreSQL', 'MongoDB', 'Docker', 'K8s', 'Git', 'GitHub', 'VSCode', 'Linux'],
      expTitle: "경력 사항",
      eduTitle: "학력 사항",
      experience: [
        {
          role: "S/W 리드 개발자",
          company: "제로원 (ZeroOne)",
          period: "2025.04 - 현재",
          description: "FastAPI, React, React Native를 활용한 소프트웨어 개발 리딩."
        },
        {
          role: "역량 강화 (Skill Enhancement)",
          company: "경력 전환기",
          period: "2023.03 - 2025.04",
          description: "새로운 기술 스택 습득 및 성장 주력."
        },
        {
          role: "소프트웨어 연구원",
          company: "KETI",
          period: "2021.10 - 2023.03",
          description: "Flask, Python, Vue.js를 활용한 소프트웨어 연구 개발."
        }
      ],
      education: [
        {
          degree: "컴퓨터공학 전문학사",
          school: "대학교",
          period: "2017 - 2021"
        }
      ],

    },
    CONTACT_TEXT: `
통신 채널 개방됨:
----------------------------
> 블로그   : ruehan.org
> 포트폴리오 : interactive-portfolio-chi.vercel.app
> 깃허브   : github.com/ruehan
`,
    WELCOME: "Ruehan의 포트폴리오에 오신 것을 환영합니다.\n명령어 목록을 보려면 'help'를 입력하세요.",
    UI: {
      start_demo: "상세 정보",
      email: "이메일",
      github: "깃허브",
      linkedin: "링크드인",
      class: "클래스: 풀스택",
      level: "레벨: 28",
      processing: "처리 중...",
      system_error: "시스템 오류: AI 코어에 접근할 수 없습니다.",
      searching: "신경망 검색 중...",
      input_placeholder: "명령어 입력...",
      ai_input_placeholder: "AI에게 질문...",
      system_name: "[시스템]",
      user_prefix: "guest@ruehan:~$",
      ai_prefix: "AI@assistant:~$",
      ai_mode_welcome: "AI 대화 모드로 진입합니다. 'exit'을 입력하여 종료하세요.",
      ai_mode_exit: "AI 모드를 종료합니다.",
      command_not_found: "명령어를 찾을 수 없습니다: ",
      sudo_message: "권한 거부: 당신은 이 포트폴리오의 소유자가 아닙니다.",
      matrix_message: "매트릭스 비주얼 인터페이스를 전환합니다...",
      konami_message: "치트 코드 활성화: 신 모드 켜짐 (농담입니다. 기억력이 좋으시네요!)",
      tips: [
        "팁: 'matrix'를 입력해보세요.",
        "팁: 관리자를 위한 'sudo' 명령어가 있을지도 모릅니다...",
        "팁: 코나미 커맨드를 기억하시나요?",
        "팁: 'ai' 명령어로 신경망과 대화할 수 있습니다."
      ],
      status: {
        cpu: "CPU",
        mem: "메모리",
        net: "네트워크",
        uptime: "가동시간"
      },
      commands: {
        help: "help",
        about: "about",
        projects: "projects",
        contact: "contact",
        clear: "clear",
        tip: "tip"
      },
      modal: {
        features: "주요 기능",
        close: "창 닫기",
        launch: "시스템 실행"
      }
    }
  }
};