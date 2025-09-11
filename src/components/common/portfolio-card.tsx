import Image from 'next/image';

const Card = ({
  title,
  desc,
  img,
  tags,
}: {
  title: string;
  desc: string;
  img: string;
  tags: string[];
}) => {
  return (
    <div
      className={
        'portfolio_card w-[230px] h-[300px] bg-black rounded-lg shadow-lg hover:shadow-2xl' +
        ' transform hover:scale-105 hover:-translate-x-1 hover:-translate-y-1 transition-transform duration-200'
      }
    >
      <div className="relative w-full h-[100px]">
        <Image
          src={img}
          layout="fill"
          objectFit="cover"
          alt="Project image"
          className="rounded-t-lg"
        />
      </div>

      <div className="p-2">
        <h4 className="text-brand1 text-lg font-bold">{title}</h4>
      </div>

      <div className="px-2 text-sm text-gray-400 min-h-[50px]">{desc}</div>

      <div className="flex flex-wrap justify-center space-x-2 p-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="border border-brand2/50 rounded-xl px-2 py-1 mt-1 text-xs text-brand2"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Card;
