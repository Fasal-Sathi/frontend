import { motion } from "framer-motion";
export default function Section({children,className=""}) {
  return <motion.section initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.6}} className={className}>{children}</motion.section>
}
