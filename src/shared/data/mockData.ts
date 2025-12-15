// Mock data for demo purposes - simulates backend responses
export const mockCourses = [
  {
    _id: "course1",
    courseName: "Complete Web Development Bootcamp 2024",
    courseDescription: "Master web development with HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and become a full-stack developer.",
    whatYouWillLearn: "You will learn HTML5, CSS3, JavaScript ES6+, React.js, Node.js, Express.js, MongoDB, RESTful APIs, Authentication, Deployment, and much more!",
    courseContent: [
      {
        _id: "section1",
        sectionName: "Introduction to Web Development",
        subSection: [
          {
            _id: "subsection1",
            title: "Welcome to the Course",
            description: "Introduction and course overview",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            timeDuration: "10:30"
          },
          {
            _id: "subsection2",
            title: "Setting Up Your Development Environment",
            description: "Install VS Code, Node.js, and essential tools",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            timeDuration: "15:45"
          }
        ]
      },
      {
        _id: "section2",
        sectionName: "HTML & CSS Fundamentals",
        subSection: [
          {
            _id: "subsection3",
            title: "HTML Basics",
            description: "Learn HTML tags, elements, and structure",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            timeDuration: "25:20"
          },
          {
            _id: "subsection4",
            title: "CSS Styling",
            description: "Master CSS selectors, properties, and layouts",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            timeDuration: "30:15"
          }
        ]
      }
    ],
    ratingAndReviews: [
      {
        _id: "review1",
        user: {
          firstName: "John",
          lastName: "Doe",
          image: "https://api.dicebear.com/5.x/initials/svg?seed=John Doe"
        },
        rating: 5,
        review: "Excellent course! Very comprehensive and well-structured."
      },
      {
        _id: "review2",
        user: {
          firstName: "Jane",
          lastName: "Smith",
          image: "https://api.dicebear.com/5.x/initials/svg?seed=Jane Smith"
        },
        rating: 4,
        review: "Great content, learned a lot. Would recommend!"
      }
    ],
    price: 2999,
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    tag: ["Web Development", "Full Stack", "React"],
    category: {
      _id: "cat1",
      name: "Web Development"
    },
    instructor: {
      _id: "inst1",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@example.com",
      image: "https://api.dicebear.com/5.x/initials/svg?seed=Sarah Johnson"
    },
    studentsEnrolled: ["student1", "student2", "student3"],
    instructions: ["Basic computer knowledge", "Passion to learn", "Internet connection"],
    status: "Published",
    createdAt: "2024-01-15T10:00:00.000Z"
  },
  {
    _id: "course2",
    courseName: "Python for Data Science & Machine Learning",
    courseDescription: "Learn Python programming and dive into data science, machine learning, and AI. Work with real datasets and build ML models.",
    whatYouWillLearn: "Python fundamentals, NumPy, Pandas, Matplotlib, Scikit-learn, Machine Learning algorithms, Data visualization, and practical projects.",
    courseContent: [
      {
        _id: "section3",
        sectionName: "Python Basics",
        subSection: [
          {
            _id: "subsection5",
            title: "Python Introduction",
            description: "Getting started with Python",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            timeDuration: "12:00"
          }
        ]
      }
    ],
    ratingAndReviews: [
      {
        _id: "review3",
        user: {
          firstName: "Mike",
          lastName: "Wilson",
          image: "https://api.dicebear.com/5.x/initials/svg?seed=Mike Wilson"
        },
        rating: 5,
        review: "Best Python course I've taken. Very practical!"
      }
    ],
    price: 3499,
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
    tag: ["Python", "Data Science", "Machine Learning"],
    category: {
      _id: "cat2",
      name: "Data Science"
    },
    instructor: {
      _id: "inst2",
      firstName: "David",
      lastName: "Chen",
      email: "david@example.com",
      image: "https://api.dicebear.com/5.x/initials/svg?seed=David Chen"
    },
    studentsEnrolled: ["student1", "student4"],
    instructions: ["No prior programming experience needed", "Computer with 4GB RAM minimum"],
    status: "Published",
    createdAt: "2024-02-20T10:00:00.000Z"
  },
  {
    _id: "course3",
    courseName: "Mobile App Development with React Native",
    courseDescription: "Build cross-platform mobile apps for iOS and Android using React Native. Learn from scratch to deployment.",
    whatYouWillLearn: "React Native fundamentals, Navigation, State management, API integration, Native modules, Publishing to App Store and Play Store.",
    courseContent: [
      {
        _id: "section4",
        sectionName: "Getting Started with React Native",
        subSection: [
          {
            _id: "subsection6",
            title: "React Native Setup",
            description: "Environment setup for mobile development",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            timeDuration: "18:30"
          }
        ]
      }
    ],
    ratingAndReviews: [],
    price: 2799,
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    tag: ["Mobile Development", "React Native", "iOS", "Android"],
    category: {
      _id: "cat3",
      name: "Mobile Development"
    },
    instructor: {
      _id: "inst1",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@example.com",
      image: "https://api.dicebear.com/5.x/initials/svg?seed=Sarah Johnson"
    },
    studentsEnrolled: ["student2"],
    instructions: ["Basic JavaScript knowledge", "Mac for iOS development (optional)"],
    status: "Published",
    createdAt: "2024-03-10T10:00:00.000Z"
  },
  {
    _id: "course4",
    courseName: "UI/UX Design Masterclass",
    courseDescription: "Master the art of user interface and user experience design. Learn design principles, tools, and create stunning designs.",
    whatYouWillLearn: "Design principles, Figma, Adobe XD, Prototyping, User research, Wireframing, Visual design, Design systems.",
    courseContent: [
      {
        _id: "section5",
        sectionName: "Design Fundamentals",
        subSection: [
          {
            _id: "subsection7",
            title: "Introduction to UI/UX",
            description: "Understanding user-centered design",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            timeDuration: "14:20"
          }
        ]
      }
    ],
    ratingAndReviews: [
      {
        _id: "review4",
        user: {
          firstName: "Emma",
          lastName: "Brown",
          image: "https://api.dicebear.com/5.x/initials/svg?seed=Emma Brown"
        },
        rating: 5,
        review: "Amazing course! Transformed my design skills."
      }
    ],
    price: 2499,
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    tag: ["Design", "UI/UX", "Figma"],
    category: {
      _id: "cat4",
      name: "Design"
    },
    instructor: {
      _id: "inst3",
      firstName: "Lisa",
      lastName: "Anderson",
      email: "lisa@example.com",
      image: "https://api.dicebear.com/5.x/initials/svg?seed=Lisa Anderson"
    },
    studentsEnrolled: ["student3", "student4", "student5"],
    instructions: ["Creative mindset", "Computer with design software"],
    status: "Published",
    createdAt: "2024-01-25T10:00:00.000Z"
  },
  {
    _id: "course5",
    courseName: "DevOps & Cloud Computing with AWS",
    courseDescription: "Learn DevOps practices and cloud computing with AWS. Master CI/CD, Docker, Kubernetes, and cloud infrastructure.",
    whatYouWillLearn: "AWS services, Docker, Kubernetes, CI/CD pipelines, Infrastructure as Code, Monitoring, Security best practices.",
    courseContent: [
      {
        _id: "section6",
        sectionName: "Introduction to DevOps",
        subSection: [
          {
            _id: "subsection8",
            title: "What is DevOps?",
            description: "Understanding DevOps culture and practices",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            timeDuration: "16:45"
          }
        ]
      }
    ],
    ratingAndReviews: [],
    price: 3999,
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800",
    tag: ["DevOps", "AWS", "Cloud", "Docker"],
    category: {
      _id: "cat5",
      name: "DevOps"
    },
    instructor: {
      _id: "inst2",
      firstName: "David",
      lastName: "Chen",
      email: "david@example.com",
      image: "https://api.dicebear.com/5.x/initials/svg?seed=David Chen"
    },
    studentsEnrolled: ["student1"],
    instructions: ["Basic Linux knowledge", "AWS account (free tier)"],
    status: "Published",
    createdAt: "2024-02-05T10:00:00.000Z"
  },
  {
    _id: "course6",
    courseName: "Digital Marketing Mastery 2024",
    courseDescription: "Complete digital marketing course covering SEO, social media, email marketing, content marketing, and analytics.",
    whatYouWillLearn: "SEO optimization, Google Ads, Facebook Ads, Content strategy, Email campaigns, Analytics, Social media marketing.",
    courseContent: [
      {
        _id: "section7",
        sectionName: "Digital Marketing Basics",
        subSection: [
          {
            _id: "subsection9",
            title: "Introduction to Digital Marketing",
            description: "Overview of digital marketing landscape",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            timeDuration: "13:15"
          }
        ]
      }
    ],
    ratingAndReviews: [
      {
        _id: "review5",
        user: {
          firstName: "Alex",
          lastName: "Martinez",
          image: "https://api.dicebear.com/5.x/initials/svg?seed=Alex Martinez"
        },
        rating: 4,
        review: "Very informative and practical. Great for beginners!"
      }
    ],
    price: 1999,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    tag: ["Marketing", "SEO", "Social Media"],
    category: {
      _id: "cat6",
      name: "Marketing"
    },
    instructor: {
      _id: "inst4",
      firstName: "Maria",
      lastName: "Garcia",
      email: "maria@example.com",
      image: "https://api.dicebear.com/5.x/initials/svg?seed=Maria Garcia"
    },
    studentsEnrolled: ["student2", "student5"],
    instructions: ["No prior experience needed", "Internet connection"],
    status: "Published",
    createdAt: "2024-03-01T10:00:00.000Z"
  }
];

export const mockCategories = [
  {
    _id: "cat1",
    name: "Web Development",
    description: "Learn to build websites and web applications",
    courses: ["course1"]
  },
  {
    _id: "cat2",
    name: "Data Science",
    description: "Master data analysis and machine learning",
    courses: ["course2"]
  },
  {
    _id: "cat3",
    name: "Mobile Development",
    description: "Build mobile apps for iOS and Android",
    courses: ["course3"]
  },
  {
    _id: "cat4",
    name: "Design",
    description: "Create beautiful user interfaces and experiences",
    courses: ["course4"]
  },
  {
    _id: "cat5",
    name: "DevOps",
    description: "Learn cloud computing and DevOps practices",
    courses: ["course5"]
  },
  {
    _id: "cat6",
    name: "Marketing",
    description: "Master digital marketing strategies",
    courses: ["course6"]
  }
];

export const mockUserData = {
  student: {
    _id: "student1",
    firstName: "Demo",
    lastName: "Student",
    email: "student@demo.com",
    accountType: "Student",
    image: "https://api.dicebear.com/5.x/initials/svg?seed=Demo Student",
    courses: ["course1", "course2"],
    courseProgress: [
      {
        courseID: "course1",
        completedVideos: ["subsection1"]
      }
    ],
    additionalDetails: {
      about: "Passionate learner exploring new technologies",
      contactNumber: "+1234567890",
      gender: "Male",
      dateOfBirth: "1995-05-15"
    }
  },
  instructor: {
    _id: "inst1",
    firstName: "Demo",
    lastName: "Instructor",
    email: "instructor@demo.com",
    accountType: "Instructor",
    image: "https://api.dicebear.com/5.x/initials/svg?seed=Demo Instructor",
    courses: ["course1", "course3"],
    additionalDetails: {
      about: "Experienced educator passionate about teaching",
      contactNumber: "+1234567890",
      gender: "Female",
      dateOfBirth: "1988-08-20"
    }
  }
};

export const mockInstructorStats = {
  totalAmount: 15999,
  totalStudents: 6,
  courses: [
    {
      _id: "course1",
      courseName: "Complete Web Development Bootcamp 2024",
      courseDescription: "Master web development with HTML, CSS, JavaScript, React, Node.js, and MongoDB.",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      price: 2999,
      studentsEnrolled: 3,
      totalAmountGenerated: 8997
    },
    {
      _id: "course3",
      courseName: "Mobile App Development with React Native",
      courseDescription: "Build cross-platform mobile apps for iOS and Android using React Native.",
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
      price: 2799,
      studentsEnrolled: 1,
      totalAmountGenerated: 2799
    }
  ]
};
