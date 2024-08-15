import {Link} from "@tanstack/react-router";

const Header = () => {
  return (
    <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <img
          src='https://firebasestorage.googleapis.com/v0/b/propbear-io.appspot.com/o/flovex%2Fflowvex.png?alt=media&token=ad327732-3b30-4600-a0cc-fd624bc32718'
          alt='flowvex'
          className='h-6 w-6'
        />
        <div className='flex flex-row'>
          <span className="font-normal text-lg">
            flowvex
          </span>
          <span className="flex items-end ml-2 mb-1 font-thin text-xs text-gray-400">
            ver 1.0.0
          </span>
        </div>
      </Link>
    </div>
  )
}

export default Header;