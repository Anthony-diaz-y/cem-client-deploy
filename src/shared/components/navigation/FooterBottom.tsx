import Link from "next/link";
import { ImGithub, ImLinkedin2 } from "react-icons/im";

interface FooterBottomProps {
  bottomFooter: string[];
}

const FooterBottom = ({ bottomFooter }: FooterBottomProps) => {
  return (
    <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto pb-14 text-sm">
      <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
        <div className="flex">
          {bottomFooter.map((ele, ind) => (
            <div
              key={ind}
              className={`${
                bottomFooter.length - 1 === ind
                  ? ""
                  : "border-r border-richblack-700"
              } px-3 cursor-pointer hover:text-richblack-50 transition-all duration-200`}
            >
              <Link href={ele.split(" ").join("-").toLocaleLowerCase()}>
                {ele}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center flex flex-col sm:flex-row">
          <div className="flex">
            <span>Developed By:</span>
            <Link
              href="https://github.com/Aniruddha-Gade"
              target="__blank"
              className="text-white hover:underline mr-1"
            >
              Harsh Agrawal
            </Link>
          </div>
          <span>© 2025 Learnhub</span>
        </div>

        <div className="flex items-center">
          <a
            href="https://www.linkedin.com/in/aniruddha-gade-a48800231/"
            className="text-white p-3 hover:bg-richblack-700 rounded-full duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ImLinkedin2 size={17} />
          </a>
          <a
            href="https://www.github.com/Aniruddha-Gade"
            className="text-white p-3 hover:bg-richblack-700 rounded-full duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ImGithub size={17} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;

