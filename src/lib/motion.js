export const motionEase = [0.22, 1, 0.36, 1]

export const viewportOnce = {
  once: true,
  amount: 0.2,
}

export const revealVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: motionEase,
    },
  },
}

export const fadeDownVariants = {
  hidden: {
    opacity: 0,
    y: -22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: motionEase,
    },
  },
}

export const createStaggerContainer = (staggerChildren = 0.14, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
})

export const hoverSpring = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
}

export const getInViewMotion = (reduceMotion) => {
  if (reduceMotion) {
    return {
      initial: false,
      whileInView: undefined,
      viewport: undefined,
      animate: 'visible',
    }
  }

  return {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: viewportOnce,
  }
}

export const getLoadMotion = (reduceMotion) => {
  if (reduceMotion) {
    return {
      initial: false,
      animate: 'visible',
    }
  }

  return {
    initial: 'hidden',
    animate: 'visible',
  }
}
