import Link from "next/link";

interface FooterLink {
  title: string;
  link: string;
}

interface FooterLinksProps {
  title: string;
  links: FooterLink[];
}

const FooterLinks = ({ title, links }: FooterLinksProps) => {
  return (
    <div className="w-[35%] lg:w-[30%] mb-7 lg:pl-0">
      <h1 className="text-richblack-50 font-semibold text-[16px]">{title}</h1>
      <div className="flex flex-col gap-2 mt-2">
        {links.map((link, index) => (
          <div
            key={index}
            className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
          >
            <Link href={link.link}>{link.title}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FooterLinks;

