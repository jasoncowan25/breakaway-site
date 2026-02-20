/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/Toronto',
        destination: '/pickleball-camps',
        permanent: true,
      },
      {
        source: '/toronto',
        destination: '/pickleball-camps',
        permanent: true,
      },
      // Specific camp page redirects (must come before wildcard)
      {
        source: '/camps/toronto-april',
        destination: '/pickleball-camps/toronto-intermediate-pickleball-camp',
        permanent: true,
      },
      {
        source: '/pickleball-camps/toronto-april',
        destination: '/pickleball-camps/toronto-intermediate-pickleball-camp',
        permanent: true,
      },
      {
        source: '/camps/kids-march-break',
        destination: '/pickleball-camps',
        permanent: true,
      },
      {
        source: '/pickleball-camps/kids-march-break',
        destination: '/pickleball-camps',
        permanent: true,
      },
      {
        source: '/pickleball-camps/march-break-pickleball-camp-kids-toronto',
        destination: '/pickleball-camps',
        permanent: true,
      },
      {
        source: '/camps/saint-martin-clinic',
        destination: '/pickleball-camps/saint-martin-pickleball-clinic',
        permanent: true,
      },
      {
        source: '/pickleball-camps/saint-martin-clinic',
        destination: '/pickleball-camps/saint-martin-pickleball-clinic',
        permanent: true,
      },
      // General redirects
      {
        source: '/camps',
        destination: '/pickleball-camps',
        permanent: true,
      },
      {
        source: '/camps/:path*',
        destination: '/pickleball-camps/:path*',
        permanent: true,
      },
      {
        source: '/coaches',
        destination: '/pickleball-coaches',
        permanent: true,
      },
      {
        source: '/experience',
        destination: '/pickleball-camp-experience',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
