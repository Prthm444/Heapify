import Navbar from "../components/Navbar.jsx";

export default function NotFoundPage() {
	return (
		<>
			<Navbar />

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
					textAlign: "center",
				}}
			>
				<div id="ghost">
					<div id="red">
						<div id="pupil"></div>
						<div id="pupil1"></div>
						<div id="eye"></div>
						<div id="eye1"></div>
						{Array.from({ length: 5 }, (_, i) => (
							<div key={`top${i}`} id={`top${i}`}></div>
						))}
						{Array.from({ length: 6 }, (_, i) => (
							<div key={`st${i}`} id={`st${i}`}></div>
						))}
						{Array.from({ length: 18 }, (_, i) => (
							<div key={`an${i + 1}`} id={`an${i + 1}`}></div>
						))}
					</div>
					<div id="shadow"></div>
				</div>

				<h1
					style={{
						fontSize: "2rem",
						color: "#333",
						marginTop: "2rem",
						fontWeight: "bold",
					}}
				>
					Page Not Found
				</h1>

				<style>{`
				#ghost {
					position: relative;
					scale: 0.8;
					width :full;
					height : full;
				}

				#red {
					animation: upNDown infinite 0.5s;
					position: relative;
					width: 140px;
					height: 140px;
					display: grid;
					grid-template-columns: repeat(14, 1fr);
					grid-template-rows: repeat(14, 1fr);
					grid-column-gap: 0px;
					grid-row-gap: 0px;
					grid-template-areas:
						"a1  a2  a3  a4  a5  top0  top0  top0  top0  a10 a11 a12 a13 a14"
						"b1  b2  b3  top1 top1 top1 top1 top1 top1 top1 top1 b12 b13 b14"
						"c1 c2 top2 top2 top2 top2 top2 top2 top2 top2 top2 top2 c13 c14"
						"d1 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 d14"
						"e1 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 e14"
						"f1 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 f14"
						"top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
						"top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
						"top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
						"top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
						"top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
						"top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
						"st0 st0 an4 st1 an7 st2 an10 an10 st3 an13 st4 an16 st5 st5"
						"an1 an2 an3 an5 an6 an8 an9 an9 an11 an12 an14 an15 an17 an18";
				}

				@keyframes upNDown {
					0%, 49% { transform: translateY(0px); }
					50%, 100% { transform: translateY(-10px); }
				}

				#top0, #top1, #top2, #top3, #top4,
				#st0, #st1, #st2, #st3, #st4, #st5 {
					background-color: red;
				}

				${[...Array(5).keys()].map((i) => `#top${i} { grid-area: top${i}; }`).join("\n")}
				${[...Array(6).keys()].map((i) => `#st${i} { grid-area: st${i}; }`).join("\n")}
				${[...Array(18).keys()]
					.map((i) => {
						const index = i + 1;
						const flicker = [0, 5, 6, 7, 8, 11, 12, 13].includes(index) ? "flicker0" : "flicker1";
						return `#an${index} { grid-area: an${index}; animation: ${flicker} infinite 0.5s; }`;
					})
					.join("\n")}

				@keyframes flicker0 {
					0%, 49% { background-color: red; }
					50%, 100% { background-color: transparent; }
				}
				@keyframes flicker1 {
					0%, 49% { background-color: transparent; }
					50%, 100% { background-color: red; }
				}

				#eye {
					width: 40px;
					height: 50px;
					position: absolute;
					top: 30px;
					left: 10px;
				}
				#eye::before {
					content: "";
					background-color: white;
					width: 20px;
					height: 50px;
					transform: translateX(10px);
					display: block;
					position: absolute;
				}
				#eye::after {
					content: "";
					background-color: white;
					width: 40px;
					height: 30px;
					transform: translateY(10px);
					display: block;
					position: absolute;
				}

				#eye1 {
					width: 40px;
					height: 50px;
					position: absolute;
					top: 30px;
					right: 30px;
				}
				#eye1::before {
					content: "";
					background-color: white;
					width: 20px;
					height: 50px;
					transform: translateX(10px);
					display: block;
					position: absolute;
				}
				#eye1::after {
					content: "";
					background-color: white;
					width: 40px;
					height: 30px;
					transform: translateY(10px);
					display: block;
					position: absolute;
				}

				#pupil, #pupil1 {
					width: 20px;
					height: 20px;
					background-color: blue;
					position: absolute;
					top: 50px;
					z-index: 1;
					animation: eyesMovement infinite 3s;
				}
				#pupil { left: 10px; }
				#pupil1 { right: 50px; }

				@keyframes eyesMovement {
					0%, 49% { transform: translateX(0px); }
					50%, 99% { transform: translateX(10px); }
					100% { transform: translateX(0px); }
				}

				#shadow {
					background-color: black;
					width: 140px;
					height: 140px;
					position: absolute;
					border-radius: 50%;
					transform: rotateX(80deg);
					filter: blur(20px);
					top: 80%;
					animation: shadowMovement infinite 0.5s;
				}
				@keyframes shadowMovement {
					0%, 49% { opacity: 0.5; }
					50%, 100% { opacity: 0.2; }
				}
			`}</style>
			</div>
		</>
	);
}
