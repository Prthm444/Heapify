import React from "react";

// The CSS is embedded as a string to be injected via a <style> tag.
const liquidLoaderStyles = `
  .liquid-loader-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100px; /* Ensures the container has some space */
  }

  .liquid-loader-container span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap; /* Prevents text from wrapping */
    
    color: #fff;
    font-size: 38px;
    letter-spacing: 5px;
  }

  /* This is the background stroke layer */
  .liquid-loader-container span:nth-child(1) {
    color: transparent;
    -webkit-text-stroke: 0.3px rgb(0, 57, 244);
  }

  /* This is the animated, "filled" layer */
  .liquid-loader-container span:nth-child(2) {
    color: rgb(0, 4, 255);
    -webkit-text-stroke: 1px rgb(17, 0, 255);
    animation: liquid-fill-animation 3s ease-in-out infinite;
  }

  @keyframes liquid-fill-animation {
    0%, 100% {
      clip-path: polygon(0% 45%, 15% 44%, 32% 50%, 54% 60%, 70% 61%, 84% 59%, 100% 52%, 100% 100%, 0% 100%);
    }

    50% {
      clip-path: polygon(0% 60%, 16% 65%, 34% 66%, 51% 62%, 67% 50%, 84% 45%, 100% 46%, 100% 100%, 0% 100%);
    }
  }
`;

/**
 * A self-contained liquid-fill text animation loader component.
 *
 * @param {object} props - The component's props.
 * @param {string} [props.text="Loading..."] - The text to display.
 * @param {string} [props.className=""] - Additional class names for custom styling.
 */
const SubmissionsLoader = ({ text = "Loading...", className = "" }) => {
	const componentClassName = `liquid-loader-container ${className}`.trim();

	return (
		<>
			{/* Inject the styles into the document head */}
			<style>{liquidLoaderStyles}</style>
			<div className={componentClassName}>
				<span>{text}</span>
				<span>{text}</span>
			</div>
		</>
	);
};

export default SubmissionsLoader;
