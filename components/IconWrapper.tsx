// components/IconWrapper.tsx
import { IconBaseProps } from "react-icons";

const IconWrapper: React.FC<IconBaseProps & { className?: string }> = ({ className, children }) => {
    return <span className={className}>{children}</span>;
};

export default IconWrapper;
