import {Link} from "@tanstack/react-router";

const Header = () => {
  return (
    <div className="flex items-center">
      <Link to="/" className="-ml-2 flex items-center gap-2 font-semibold">
        <img
          src='https://firebasestorage.googleapis.com/v0/b/propbear-io.appspot.com/o/flovex%2Fflowvex.png?alt=media&token=ad327732-3b30-4600-a0cc-fd624bc32718'
          alt='flowvex'
          className='h-6 w-6'
        />
        <div className='flex flex-row'>
          <span className="font-normal text-lg">
            flowvex
          </span>
        </div>
      </Link>
    </div>
  )
}

export default Header;