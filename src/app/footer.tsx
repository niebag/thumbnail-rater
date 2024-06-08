export function Footer() {
    return (
        <footer className='p-4 bg-white sm:p-6 dark:bg-gray-800 mt-12'>
            <div className='mx-auto max-w-screen-xl'>
                <div className='md:flex md:justify-between'>
                    <div className='mb-6 md:mb-0'>
                        <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>
                            ThumbnailRater
                        </span>
                    </div>
                    <div className='grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3'>
                        <div>
                            <h2 className='mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white'>
                                Legal
                            </h2>
                            <ul className='text-gray-600 dark:text-gray-400'>
                                <li className='mb-4'>
                                    <a
                                        href='#'
                                        className='hover:underline'
                                    >
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href='#'
                                        className='hover:underline'
                                    >
                                        Terms &amp; Conditions
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className='my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8' />
                <div className='sm:flex sm:items-center sm:justify-between'>
                    <span className='text-sm text-gray-500 sm:text-center dark:text-gray-400'>
                        © 2024 ThumbnailRater™ . All Rights Reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
}
