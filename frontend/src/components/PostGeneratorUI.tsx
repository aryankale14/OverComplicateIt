import { useState, useEffect } from "react";
import { Copy, Check, Sparkles, Zap, PenTool, Linkedin } from "lucide-react";

const STYLES = [
	{ value: "Hustle Guru", label: "Hustle Guru", emoji: "🏋️" },
	{ value: "Startup Founder", label: "Startup Founder", emoji: "🚀" },
	{
		value: "Corporate Slave Turned Visionary",
		label: "Corporate Visionary",
		emoji: "🧘",
	},
	{ value: "The AI Evangelist", label: "AI Evangelist", emoji: "🤖" },
	{
		value: "The Over-Empathic Recruiter",
		label: "Empathic Recruiter",
		emoji: "🥺",
	},
	{ value: "The Ex-FAANG Tech Lead", label: "Ex-FAANG Tech Lead", emoji: "💻" },
	{
		value: "The Overly-Enthusiastic Intern",
		label: "Enthusiastic Intern",
		emoji: "🤩",
	},
];

const PostGeneratorUI = ({ onAnalyticsClick }: { onAnalyticsClick?: () => void }) => {
	const [input, setInput] = useState("");
	const [style, setStyle] = useState("Hustle Guru");
	const [cringeLevel, setCringeLevel] = useState(5);
	const [lengthLevel, setLengthLevel] = useState(2);
	const [generatedPost, setGeneratedPost] = useState("");
	const [loading, setLoading] = useState(false);
	const [copied, setCopied] = useState(false);
	const [charCount, setCharCount] = useState(0);

	useEffect(() => {
		setCharCount(generatedPost.length);
	}, [generatedPost]);

	const handleGenerate = async () => {
		if (!input.trim()) return;

		setLoading(true);
		setGeneratedPost("");
		setCopied(false);

		try {
			// @ts-ignore
			const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/generate`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					input,
					style,
					cringe_level: cringeLevel,
					post_length:
						lengthLevel === 1 ? "Short" : lengthLevel === 2 ? "Medium" : "Long",
				}),
			});

			const data = await response.json();
			if (response.ok) {
				setGeneratedPost(data.post);
			} else {
				alert("Failed to generate post: " + (data.detail || "Unknown error"));
			}
		} catch {
			alert("Error fetching from server. Is the backend running?");
		} finally {
			setLoading(false);
		}
	};

	const handleCopy = () => {
		if (generatedPost) {
			navigator.clipboard.writeText(generatedPost);
			setCopied(true);
			setTimeout(() => setCopied(false), 2500);
		}
	};

	const getCringeLabel = (level: number) => {
		if (level <= 3) return "Mild 😌";
		if (level <= 7) return "Spicy 🌶️";
		return "Unhinged 🤯";
	};

	const getLengthLabel = (level: number) => {
		if (level === 1) return "Short";
		if (level === 2) return "Medium";
		return "Long";
	};

	return (
		<>
			{/* Animated background */}
			<div className="bg-noise" />
			<div className="bg-gradient-orbs">
				<div className="orb orb-1" />
				<div className="orb orb-2" />
				<div className="orb orb-3" />
			</div>

			<div className="app-wrapper">
				{/* Header */}
				<header className="app-header">
					<div className="logo-icon">
						<Linkedin size={28} color="#fff" />
					</div>
					<h1>OverComplicateIt</h1>
					<p>
						Stop writing normal sentences. Turn your breakfast, your commute, or
						your naps into 500-word inspirational B2B essays that will make your
						network cringe.{" "}
					</p>
					<p>
						Every minor inconvenience is a lesson in B2B SaaS. Type in what you
						did today, select your guru persona, and disrupt the feed.
					</p>
				</header>

				{/* Main content grid */}
				<div className="main-grid">
					{/* ─── INPUT CARD ─── */}
					<div className="glass-card">
						<div className="section-header">
							<div className="section-icon">
								<PenTool size={18} />
							</div>
							<div>
								<h2>Compose</h2>
								<span className="section-subtitle">
									Configure your viral masterpiece
								</span>
							</div>
						</div>

						{/* Core Event Input */}
						<div className="field-group">
							<span className="field-label">Core Event</span>
							<div className="input-wrapper">
								<input
									className="text-input"
									type="text"
									placeholder='e.g., "I ate breakfast today"'
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
								/>
							</div>
						</div>

						{/* Persona Style */}
						<div className="style-selector">
							<span className="field-label">Persona Style</span>
							<div className="style-options">
								{STYLES.map((s) => (
									<button
										key={s.value}
										className={`style-pill ${style === s.value ? "active" : ""}`}
										onClick={() => setStyle(s.value)}
									>
										<span className="pill-emoji">{s.emoji}</span>
										{s.label}
									</button>
								))}
							</div>
						</div>

						{/* Cringe Level Slider */}
						<div className="slider-group">
							<div className="slider-header">
								<span className="slider-label">Cringe Level</span>
								<span className="slider-badge cringe">
									{getCringeLabel(cringeLevel)}
								</span>
							</div>
							<div className="slider-track-wrapper">
								<input
									type="range"
									min="1"
									max="10"
									value={cringeLevel}
									onChange={(e) => setCringeLevel(Number(e.target.value))}
									style={{
										background: `linear-gradient(to right, var(--accent-orange) 0%, var(--accent-orange) ${((cringeLevel - 1) / 9) * 100}%, var(--border-default) ${((cringeLevel - 1) / 9) * 100}%, var(--border-default) 100%)`,
									}}
								/>
							</div>
							<div className="slider-labels">
								<span>Mild jargon</span>
								<span>Heavy buzzwords</span>
								<span>Full lunacy</span>
							</div>
						</div>

						{/* Post Length Slider */}
						<div className="slider-group">
							<div className="slider-header">
								<span className="slider-label">Post Length</span>
								<span className="slider-badge length">
									{getLengthLabel(lengthLevel)}
								</span>
							</div>
							<div className="slider-track-wrapper">
								<input
									type="range"
									min="1"
									max="3"
									value={lengthLevel}
									onChange={(e) => setLengthLevel(Number(e.target.value))}
									style={{
										background: `linear-gradient(to right, var(--accent-purple) 0%, var(--accent-purple) ${((lengthLevel - 1) / 2) * 100}%, var(--border-default) ${((lengthLevel - 1) / 2) * 100}%, var(--border-default) 100%)`,
									}}
								/>
							</div>
							<div className="slider-labels">
								<span>Short</span>
								<span>Medium</span>
								<span>Long</span>
							</div>
						</div>

						{/* Generate Button */}
						<button
							className="generate-btn"
							onClick={handleGenerate}
							disabled={loading || !input.trim()}
						>
							{loading ? (
								<div className="loader-dots">
									<span />
									<span />
									<span />
								</div>
							) : (
								<>
									<Zap size={18} />
									<span>Generate Post</span>
								</>
							)}
						</button>
					</div>

					{/* ─── RESULT CARD ─── */}
					<div className="glass-card result-card">
						<div className="section-header">
							<div
								className="section-icon"
								style={{
									background: "rgba(163, 113, 247, 0.08)",
									color: "var(--accent-purple)",
								}}
							>
								<Sparkles size={18} />
							</div>
							<div>
								<h2>Output</h2>
								<span className="section-subtitle">
									{generatedPost
										? `${charCount} characters`
										: "Ready to generate"}
								</span>
							</div>
						</div>

						<div className="result-body">
							{generatedPost && (
								<button
									className={`copy-btn ${copied ? "copied" : ""}`}
									onClick={handleCopy}
									title="Copy to clipboard"
								>
									{copied ? <Check size={14} /> : <Copy size={14} />}
									{copied ? "Copied!" : "Copy"}
								</button>
							)}

							{generatedPost ? (
								<div className="result-content result-animate">
									{generatedPost}
								</div>
							) : (
								<div className="result-content">
									<div className="empty-state">
										<div className="empty-icon">
											<Sparkles size={24} />
										</div>
										<p>Your viral post will appear here</p>
										<span className="empty-hint">
											Enter an event and hit Generate ⚡
										</span>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Footer */}
				<footer className="app-footer">
					Built for laughs, not for career advice 😉 
					{onAnalyticsClick && (
						<span 
							onClick={onAnalyticsClick}
							style={{ cursor: 'pointer', marginLeft: '8px', opacity: 0.5 }}
							title="View Analytics"
						>
							📊
						</span>
					)}
				</footer>
			</div>
		</>
	);
};

export default PostGeneratorUI;
