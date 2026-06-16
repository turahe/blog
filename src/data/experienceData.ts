/**
 * PROPRIETARY LICENSE
 *
 * Copyright (c) 2024 Nur Wachid. All rights reserved.
 *
 * This software and associated documentation files (the "Software") are the
 * proprietary and confidential information of Nur Wachid ("Licensor").
 * The Software is protected by copyright laws and international copyright
 * treaties, as well as other intellectual property laws and treaties.
 *
 * RESTRICTIONS:
 * - NO REDISTRIBUTION: You may not redistribute, sell, lease, rent,
 *   lend, or otherwise transfer the Software to any third party without
 *   the express written consent of Nur Wachid.
 * - NO MODIFICATION: You may not modify, adapt, alter, translate, or
 *   create derivative works based on the Software without the express
 *   written consent of Nur Wachid.
 * - NO REVERSE ENGINEERING: You may not reverse engineer, decompile,
 *   disassemble, or otherwise attempt to derive the source code of the
 *   Software.
 * - NO COMMERCIAL USE: You may not use the Software for any commercial
 *   purpose without the express written consent of Nur Wachid.
 * - PERSONAL USE ONLY: This Software is provided for personal,
 *   non-commercial use only.
 *
 * For licensing inquiries, commercial use, or other permissions, please
 * contact: Nur Wachid (wachid@outlook.com)
 *
 * @license PROPRIETARY
 * @author Nur Wachid <wachid@outlook.com>
 * @copyright 2024 Nur Wachid. All rights reserved.
 */

interface Props {
  id: number
  title: string
  company: string
  location: string
  range: string
  url: string | undefined | null
  text: string[]
}

const experienceData: Props[] = [
  {
    id: 1,
    title: 'Head of Software Engineering',
    company: 'PT. Lingkar Kreasi Teknologi',
    location: 'Tangerang, Indonesia',
    range: 'August 2022 - December 2024',
    url: 'https://www.circlecreative.id',
    text: [
      'Led a team of developers, fostering a collaborative environment that increased team productivity by 20%.',
      'Delivered complex projects on time and within budget, achieving 95% client satisfaction rate.',
      'Designed scalable architecture that reduced server costs by 30% while handling 200% increase in user traffic.',
      'Mentored junior developers, accelerating their career growth with several team members receiving promotions.',
      'Implemented code review processes and standards, reducing critical bugs by 40% and improving maintainability.',
    ],
  },
  {
    id: 2,
    title: 'VP DevOps Engineer',
    company: 'PT. Lingkar Kreasi',
    location: 'Bandung, Indonesia',
    range: 'November 2019 - August 2022',
    url: 'https://www.circlecreative.id',
    text: [
      'Built automated deployment pipelines, reducing deployment time from days to minutes with error-free deployments.',
      'Implemented Infrastructure as Code using Terraform and AWS CloudFormation for version-controlled infrastructure.',
      'Architected high-availability infrastructure achieving 99.99% uptime with minimal maintenance downtime.',
      'Orchestrated containers using Kubernetes and Docker Swarm, improving resource utilization and reducing costs by 20%.',
      'Established CI/CD pipelines enabling faster code releases with 50% reduction in deployment failures.',
    ],
  },
  {
    id: 3,
    title: 'Backend Developer',
    company: 'PT. Rakhasa Artha Wisesa',
    location: 'Jakarta, Indonesia',
    range: 'February 2021 - November 2022',
    url: 'https://rakhasa.com',
    text: [
      'Optimized database queries, reducing execution times by 40% and improving application responsiveness.',
      'Implemented robust authentication and authorization mechanisms, maintaining zero security breaches over two years.',
      'Developed RESTful APIs for mobile applications, achieving 50% reduction in response times.',
      'Integrated third-party payment gateways, increasing successful transactions by 20% and boosting revenue.',
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
      'Led cross-functional teams to deliver projects on time and within budget, achieving 95% on-time completion rate.',
      'Maintained 90%+ client satisfaction through strong relationships and exceeding project expectations.',
      'Identified and mitigated project risks proactively, ensuring projects stayed on track.',
      'Managed project budgets effectively, achieving 15% cost savings through resource optimization.',
      'Implemented scope management practices, reducing scope creep by 25% and improving predictability.',
    ],
  },
  {
    id: 5,
    title: 'Web Developer',
    company: 'PT Danadipa Central Niaga',
    location: 'Yogyakarta, Indonesia',
    range: 'November 2017 - November 2018',
    url: null,
    text: [
      'Developed and launched large-scale websites for enterprise clients.',
      'Optimized website performance by reducing loading times and minimizing server requests.',
      'Implemented security measures including data encryption and access controls to protect against cyber threats.',
    ],
  },
]

export default experienceData
