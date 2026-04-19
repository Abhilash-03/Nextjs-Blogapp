
import Link from 'next/link'
import { HeaderActions } from './HeaderActions'
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "./ui/navigation-menu";
import BloXLogo from './BloXLogo';

const Header = async() => {
  return (
    <header className="z-[999] w-full sticky top-0">
      <div className="mx-auto flex items-center justify-between gap-4 bg-card/70 px-5 py-3 shadow-lg backdrop-blur-lg">
        <Link href={'/'} className="flex items-center gap-2" aria-label="BloX Home">
          <BloXLogo />
        </Link>
        <div className='flex items-center gap-4'>
        {/* Navigation Menu */}
        <NavigationMenu className='me-4'>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild active={true}>
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild active={false}>
                <Link href="/dashboard/createpost">Create</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild active={false}>
                <Link href="/blog">Explore</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <HeaderActions />
        </div>
      </div>
    </header>
  )
}

export default Header
