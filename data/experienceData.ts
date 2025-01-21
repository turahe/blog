interface Props {
  id: number;
  title: string,
  company: string,
  location: string,
  range: string
  url: string|undefined|null,
  text: string[],

}
const experienceData:Props[] = [
  {
    id: 1,
    title: 'Head of  Software Engineering',
    company: 'PT. Lingkar Kreasi Teknologi',
    location: 'Tangerang, Indonesia',
    range: 'Augustus 2022 - December 2024',
    url: 'https://www.circlecreative.id',
    text: [
      'Successfully led a team of developers, fostering a collaborative and high-performing environment that resulted in a 20% increase in overall team productivity.',
      'Orchestrated the timely and on-budget delivery of complex projects, ensuring adherence to project timelines and client expectations, resulting in a 95% client satisfaction rate.',
      'Designed and implemented an innovative architecture that improved system scalability, reducing server costs by 30% while accommodating a 200% increase in user traffic.',
      'Mentored and coached junior developers, enhancing their technical skills and accelerating their career growth, with several team members receiving promotions.',
      'Implemented code review processes and coding standards, resulting in a 40% reduction in critical bugs and improved code maintainability.',
    ],
  },
  {
    id: 2,
    title: 'VP devOps Engineer',
    company: 'PT. Lingkar Kreasi',
    location: 'Bandung, Indonesia',
    range: 'November 2019 - Augustus 2022',
    url: 'https://www.circlecreative.id',
    text: [
      'Designed and implemented a fully automated deployment pipeline, reducing deployment time from days to minutes, and ensuring consistent and error-free deployments.',
      'Introduced Infrastructure as Code practices using tools like Terraform or AWS CloudFormation, resulting in the provisioning of infrastructure resources that are version-controlled and reproducible.',
      'Architected a high availability infrastructure setup that achieved 99.99% uptime and minimal downtime during maintenance and updates.',
      'Orchestrated containers using Kubernetes or Docker Swarm, leading to improved resource utilization and scalability while reducing infrastructure costs by 20%.',
      'Established CI/CD pipelines that allowed for faster and more reliable code releases, resulting in a 50% reduction in deployment failures.',
    ],
  },
  {
    id: 3,
    title: 'Backend Developer',
    company: 'PT. Rakhasa Artha Wisesa',
    location: 'Jakarta, Indonesia',
    range: 'Feb 2021 - Nov 2022',
    url: 'https://rakhasa.com',
    text: [
      'Improved database query performance, reducing query execution times by 40% and enhancing overall application responsiveness.',
      'Implemented advanced security measures, including robust authentication and authorization mechanisms, leading to zero security breaches over the past two years.',
      'Developed a RESTful API for a mobile app, resulting in a 50% reduction in API response time and improved user experience.',
      'Successfully integrated third-party payment gateways, resulting in a 20% increase in successful transactions and revenue.',
    ],
  },
  {
    id: 4,
    title: 'Project Lead Developer',
    company: 'PT. Lingkar Kreasi',
    location: 'Bandung, Indonesia',
    range: 'November 2018 - November 2019',
    url: 'https://www.circlecreative.id',
    text: [
      'Led cross-functional teams to consistently deliver projects on time and within budget, achieving a 95% on-time project completion rate.',
      'Maintained a client satisfaction rate of 90% or higher by establishing strong client relationships, addressing concerns promptly, and exceeding project expectations.',
      'Successfully identified and mitigated project risks, ensuring that potential issues were addressed proactively and that projects stayed on track.',
      'Managed project budgets effectively, achieving cost savings of 15% through resource optimization and efficient project planning.',
      'Implemented effective scope management practices, resulting in a 25% reduction in project scope creep and improved project predictability.',
    ],
  },
  {
    id: 5,
    title: 'Web Developer',
    company: 'PT Danadipa Central Niaga',
    location: 'Yogyakarta, Indonesia',
    range: 'Nov 2017 - Nov 2018 ',
    url: null,
    text: [
      'Successfully developing and launching large-scale websites for clients or companies',
      'Improving website performance by reducing loading times, minimizing server requests, and optimizing images and other resources. This can enhance user experience and SEO rankings.',
      'Successfully implementing security measures such as data encryption, protection against cyberattacks, and access permission management to safeguard websites from security threats.',
    ],
  },
]

export default experienceData
