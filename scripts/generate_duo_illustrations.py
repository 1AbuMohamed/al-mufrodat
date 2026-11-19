"""Genereert 77 strakke, kleurrijke Duolingo-stijl vector-illustraties in img/duo/*.svg."""
from __future__ import annotations
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "img" / "duo"
OUT.mkdir(parents=True, exist_ok=True)


def wrap(bg: str, body: str, ground: str = "rgba(0,0,0,0.08)") -> str:
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none">'
        f'<rect width="160" height="160" rx="28" fill="{bg}"/>'
        '<circle cx="80" cy="76" r="56" fill="#FFFFFF" fill-opacity="0.55"/>'
        f'<ellipse cx="80" cy="134" rx="44" ry="8" fill="{ground}"/>'
        f"{body}"
        "</svg>"
    )


def person_head(cx=80, cy=56, r=22, skin="#FFCC99", hair_svg="", extra=""):
    eyes = (
        f'<circle cx="{cx-7}" cy="{cy}" r="2.6" fill="#2B2B2B"/>'
        f'<circle cx="{cx+7}" cy="{cy}" r="2.6" fill="#2B2B2B"/>'
        f'<circle cx="{cx-8}" cy="{cy-1}" r="0.9" fill="#FFF"/>'
        f'<circle cx="{cx+6}" cy="{cy-1}" r="0.9" fill="#FFF"/>'
        f'<ellipse cx="{cx-11}" cy="{cy+4}" rx="3.2" ry="1.8" fill="#FF8A8A" opacity="0.55"/>'
        f'<ellipse cx="{cx+11}" cy="{cy+4}" rx="3.2" ry="1.8" fill="#FF8A8A" opacity="0.55"/>'
        f'<path d="M{cx-5} {cy+7} Q{cx} {cy+12} {cx+5} {cy+7}" stroke="#2B2B2B" stroke-width="2.4" stroke-linecap="round" fill="none"/>'
    )
    ears = (
        f'<rect x="{cx-7}" y="{cy+r-4}" width="14" height="24" rx="5" fill="{skin}"/>'
        f'<circle cx="{cx-r+1}" cy="{cy+1}" r="5" fill="{skin}"/>'
        f'<circle cx="{cx+r-1}" cy="{cy+1}" r="5" fill="{skin}"/>'
    )
    return f'{ears}<circle cx="{cx}" cy="{cy}" r="{r}" fill="{skin}"/>{hair_svg}{eyes}{extra}'


ICONS: dict[str, tuple[str, str]] = {
    "house": ("#E3F6FF", """
        <path d="M36 74 L80 34 L124 74 V128 C124 131 121 134 118 134 H42 C39 134 36 131 36 128 Z" fill="#FFF4E0"/>
        <path d="M36 74 H124 V82 H36 Z" fill="#F2DFC0"/>
        <rect x="68" y="92" width="24" height="42" rx="6" fill="#C27838"/>
        <circle cx="86" cy="113" r="2.5" fill="#FFC800"/>
        <rect x="46" y="88" width="16" height="16" rx="4" fill="#84D8FF" stroke="#1CB0F6" stroke-width="3"/>
        <rect x="98" y="88" width="16" height="16" rx="4" fill="#84D8FF" stroke="#1CB0F6" stroke-width="3"/>
        <path d="M26 76 L80 28 L134 76" stroke="#FF4B4B" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="102" y="38" width="12" height="22" rx="3" fill="#D93838"/>
    """),
    "mosque": ("#E8F9E4", """
        <rect x="26" y="42" width="14" height="90" rx="5" fill="#FFF5E1"/>
        <path d="M26 44 L33 26 L40 44 Z" fill="#58CC02"/>
        <rect x="24" y="56" width="18" height="5" rx="2.5" fill="#FFC800"/>
        <path d="M48 80 C48 52 112 52 112 80 Z" fill="#58CC02"/>
        <path d="M64 56 C70 46 86 46 94 56" stroke="#89E219" stroke-width="4" stroke-linecap="round"/>
        <circle cx="80" cy="40" r="6" fill="#FFC800"/>
        <circle cx="82" cy="39" r="4.5" fill="#E8F9E4"/>
        <rect x="44" y="80" width="76" height="52" rx="6" fill="#FFF5E1"/>
        <path d="M70 132 V102 C70 92 90 92 90 102 V132 Z" fill="#1CB0F6"/>
        <rect x="52" y="94" width="10" height="16" rx="5" fill="#FFC800"/>
        <rect x="98" y="94" width="10" height="16" rx="5" fill="#FFC800"/>
    """),
    "door": ("#FFF3D9", """
        <rect x="46" y="28" width="68" height="106" rx="10" fill="#8B5A2B"/>
        <rect x="52" y="34" width="56" height="98" rx="7" fill="#C87D3B"/>
        <rect x="60" y="42" width="40" height="34" rx="5" fill="#A96428"/>
        <rect x="60" y="84" width="40" height="36" rx="5" fill="#A96428"/>
        <circle cx="98" cy="82" r="5" fill="#FFC800"/>
        <circle cx="97" cy="81" r="1.8" fill="#FFF"/>
    """),
    "book": ("#E5F6FF", """
        <rect x="38" y="30" width="84" height="100" rx="12" fill="#1899D6"/>
        <rect x="42" y="30" width="78" height="94" rx="10" fill="#1CB0F6"/>
        <rect x="42" y="30" width="12" height="94" rx="4" fill="#0F7DB3"/>
        <rect x="46" y="118" width="72" height="8" rx="4" fill="#FFF8EA"/>
        <rect x="62" y="48" width="44" height="10" rx="5" fill="#FFF"/>
        <rect x="62" y="64" width="32" height="8" rx="4" fill="#84D8FF"/>
        <path d="M98 118 V136 L104 131 L110 136 V118 Z" fill="#FF4B4B"/>
    """),
    "pen": ("#FFF0F5", """
        <g transform="rotate(-38 80 80)">
          <rect x="70" y="26" width="20" height="78" rx="5" fill="#1CB0F6"/>
          <rect x="70" y="26" width="8" height="78" rx="4" fill="#56C8FF"/>
          <rect x="70" y="36" width="20" height="7" fill="#FFC800"/>
          <path d="M90 36 H96 V66" stroke="#FFC800" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M70 104 L80 128 L90 104 Z" fill="#FFE0B2"/>
          <path d="M76 118 L80 128 L84 118 Z" fill="#2B2B2B"/>
        </g>
    """),
    "key": ("#FFF7D6", """
        <g transform="rotate(-30 80 80)">
          <circle cx="56" cy="80" r="24" fill="#FFC800"/>
          <circle cx="56" cy="80" r="10" fill="#FFF7D6"/>
          <rect x="76" y="74" width="52" height="12" rx="6" fill="#FFC800"/>
          <rect x="104" y="84" width="9" height="14" rx="3" fill="#E5A800"/>
          <rect x="117" y="84" width="9" height="18" rx="3" fill="#E5A800"/>
          <path d="M44 66 A16 16 0 0 1 66 64" stroke="#FFF" stroke-width="3.5" stroke-linecap="round"/>
        </g>
    """),
    "desk": ("#F2EFE9", """
        <rect x="26" y="66" width="108" height="14" rx="6" fill="#C87D3B"/>
        <rect x="34" y="80" width="10" height="52" rx="4" fill="#9E5E24"/>
        <rect x="86" y="80" width="40" height="50" rx="5" fill="#B56E2E"/>
        <rect x="92" y="86" width="28" height="16" rx="3" fill="#D99152"/>
        <rect x="92" y="108" width="28" height="16" rx="3" fill="#D99152"/>
        <circle cx="106" cy="94" r="2.5" fill="#FFC800"/>
        <circle cx="106" cy="116" r="2.5" fill="#FFC800"/>
        <rect x="46" y="42" width="32" height="22" rx="4" fill="#1CB0F6"/>
        <rect x="58" y="64" width="8" height="4" fill="#6F7775"/>
    """),
    "bed": ("#EDE8FF", """
        <rect x="24" y="54" width="14" height="78" rx="6" fill="#A5642A"/>
        <rect x="122" y="72" width="14" height="60" rx="6" fill="#A5642A"/>
        <rect x="34" y="96" width="92" height="18" rx="4" fill="#C87D3B"/>
        <rect x="38" y="74" width="30" height="16" rx="8" fill="#FFFFFF"/>
        <rect x="36" y="82" width="88" height="22" rx="8" fill="#1CB0F6"/>
        <path d="M66 82 H118 C122 82 124 85 124 90 V104 H66 Z" fill="#CE82FF"/>
    """),
    "chair": ("#FFF2E2", """
        <rect x="52" y="32" width="56" height="44" rx="10" fill="#C87D3B"/>
        <rect x="60" y="40" width="40" height="10" rx="5" fill="#FFF2E2"/>
        <rect x="60" y="56" width="40" height="10" rx="5" fill="#FFF2E2"/>
        <rect x="44" y="82" width="72" height="14" rx="6" fill="#E08E45"/>
        <rect x="50" y="96" width="10" height="36" rx="4" fill="#9E5E24"/>
        <rect x="100" y="96" width="10" height="36" rx="4" fill="#9E5E24"/>
        <rect x="54" y="72" width="8" height="12" fill="#9E5E24"/>
        <rect x="98" y="72" width="8" height="12" fill="#9E5E24"/>
    """),
    "star": ("#1A2B4C", """
        <circle cx="38" cy="42" r="2.5" fill="#FFF"/>
        <circle cx="124" cy="48" r="2" fill="#FFF"/>
        <circle cx="44" cy="112" r="2" fill="#FFF"/>
        <path d="M80 26 L95 58 L130 63 L104 88 L110 123 L80 106 L50 123 L56 88 L30 63 L65 58 Z" fill="#FFC800" stroke="#FFDF5D" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="71" cy="76" r="3" fill="#3B2A00"/>
        <circle cx="89" cy="76" r="3" fill="#3B2A00"/>
        <path d="M74 86 Q80 91 86 86" stroke="#3B2A00" stroke-width="2.6" stroke-linecap="round" fill="none"/>
    """),
    "shirt": ("#E3F7FF", """
        <path d="M54 36 L68 32 Q80 44 92 32 L106 36 L132 58 L118 78 L106 68 V126 C106 130 103 132 99 132 H61 C57 132 54 130 54 126 V68 L42 78 L28 58 Z" fill="#1CB0F6"/>
        <path d="M68 32 Q80 46 92 32 Q80 38 68 32 Z" fill="#0F7DB3"/>
        <circle cx="80" cy="58" r="3" fill="#FFF"/>
        <circle cx="80" cy="74" r="3" fill="#FFF"/>
        <circle cx="80" cy="90" r="3" fill="#FFF"/>
        <rect x="86" y="56" width="12" height="14" rx="3" fill="#0F7DB3" opacity="0.45"/>
    """),
    "doctor": ("#E5F9F6", person_head(80, 56, 21, "#FFCC99",
        '<path d="M58 52 C58 34 102 34 102 52 C94 44 66 44 58 52 Z" fill="#3A2A1D"/>'
        '<rect x="68" y="26" width="24" height="14" rx="5" fill="#FFF" stroke="#E0E0E0" stroke-width="1.5"/>'
        '<path d="M80 29 V37 M76 33 H84" stroke="#FF4B4B" stroke-width="3" stroke-linecap="round"/>'
    ) + """
        <path d="M46 132 C46 98 114 98 114 132 Z" fill="#FFFFFF"/>
        <path d="M72 98 L80 120 L88 98 Z" fill="#1CB0F6"/>
        <path d="M64 96 C64 114 72 118 72 124" stroke="#4B5563" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M96 96 C96 114 88 118 88 124" stroke="#4B5563" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="88" cy="124" r="4.5" fill="#9CA3AF"/>
    """),
    "boy": ("#E5F6FF", person_head(80, 62, 22, "#FFCC99",
        '<path d="M56 58 C56 36 104 36 104 58 Z" fill="#1CB0F6"/>'
        '<path d="M54 56 H114 C114 50 98 48 80 50 Z" fill="#1899D6"/>'
    ) + """
        <path d="M48 132 C48 100 112 100 112 132 Z" fill="#58CC02"/>
        <path d="M68 104 H92 V132 H68 Z" fill="#89E219" opacity="0.4"/>
    """),
    "girl": ("#FFEBF3", """
        <circle cx="56" cy="70" r="10" fill="#4A2C18"/>
        <circle cx="104" cy="70" r="10" fill="#4A2C18"/>
    """ + person_head(80, 60, 21, "#FFCC99",
        '<path d="M58 56 C58 34 102 34 102 56 C92 46 68 46 58 56 Z" fill="#4A2C18"/>'
        '<circle cx="62" cy="46" r="5" fill="#FF4B4B"/>'
        '<circle cx="98" cy="46" r="5" fill="#FF4B4B"/>'
    ) + """
        <path d="M48 132 C48 100 112 100 112 132 Z" fill="#CE82FF"/>
    """),
    "student": ("#EDE8FF", person_head(80, 62, 20, "#FFCC99",
        '<polygon points="80,26 44,40 80,52 116,40" fill="#2B2B2B"/>'
        '<rect x="64" y="44" width="32" height="8" rx="3" fill="#3F3F46"/>'
        '<path d="M108 42 V58" stroke="#FFC800" stroke-width="3" stroke-linecap="round"/>'
        '<circle cx="108" cy="60" r="3" fill="#FFC800"/>'
    ) + """
        <path d="M46 132 C46 100 114 100 114 132 Z" fill="#1CB0F6"/>
        <rect x="64" y="108" width="32" height="22" rx="4" fill="#FFC800"/>
        <line x1="80" y1="108" x2="80" y2="130" stroke="#FFF" stroke-width="2"/>
    """),
    "man": ("#E8F4FA", person_head(80, 56, 22, "#F5B982",
        '<path d="M58 50 C58 30 102 30 102 50 C92 42 68 42 58 50 Z" fill="#2B2B2B"/>',
        '<path d="M62 64 C62 82 98 82 98 64 C92 72 68 72 62 64 Z" fill="#2B2B2B"/>'
    ) + """
        <path d="M44 132 C44 96 116 96 116 132 Z" fill="#2B70C9"/>
        <path d="M72 96 L80 114 L88 96 Z" fill="#FFF"/>
    """),
    "merchant": ("#FFF3DF", person_head(80, 54, 19, "#F5B982",
        '<path d="M60 46 C60 32 100 32 100 46 Z" fill="#5C3A21"/>'
    ) + """
        <path d="M50 104 C50 82 110 82 110 104 Z" fill="#58CC02"/>
        <rect x="30" y="102" width="100" height="30" rx="6" fill="#C87D3B"/>
        <path d="M30 92 H130 L122 78 H38 Z" fill="#FF4B4B"/>
        <circle cx="56" cy="116" r="7" fill="#FFC800"/>
        <circle cx="72" cy="116" r="7" fill="#FFC800"/>
    """),
    "teacher": ("#E6F9E6", """
        <rect x="28" y="30" width="68" height="48" rx="6" fill="#2E6F40" stroke="#C87D3B" stroke-width="5"/>
        <text x="62" y="61" text-anchor="middle" font-size="22" fill="#FFF" font-family="serif">أ ب ت</text>
    """ + person_head(108, 66, 17, "#FFCC99",
        '<path d="M91 60 C91 44 125 44 125 60 Z" fill="#3A2A1D"/>'
    ) + """
        <path d="M82 132 C82 102 134 102 134 132 Z" fill="#1CB0F6"/>
        <line x1="88" y1="104" x2="64" y2="68" stroke="#C87D3B" stroke-width="4" stroke-linecap="round"/>
    """),
    "imam": ("#E8F8EE", person_head(80, 58, 21, "#F5B982",
        '<path d="M58 52 C58 30 102 30 102 52 Z" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="2"/>'
        '<rect x="58" y="46" width="44" height="8" rx="4" fill="#58CC02"/>',
        '<path d="M62 66 C62 84 98 84 98 66 C92 74 68 74 62 66 Z" fill="#2B2B2B"/>'
    ) + """
        <path d="M44 132 C44 96 116 96 116 132 Z" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="2"/>
        <path d="M70 96 V132 M90 96 V132" stroke="#D9A441" stroke-width="3"/>
    """),
    "mother": ("#FFEAF2", """
        <path d="M50 62 C50 28 110 28 110 62 V112 C110 112 96 122 80 122 C64 122 50 112 50 112 Z" fill="#CE82FF"/>
    """ + person_head(80, 62, 19, "#FFCC99") + """
        <path d="M46 132 C46 102 114 102 114 132 Z" fill="#A568CC"/>
        <path d="M80 118 C74 110 66 114 66 120 C66 126 80 132 80 132 C80 132 94 126 94 120 C94 114 86 110 80 118 Z" fill="#FF4B4B"/>
    """),
    "child": ("#FFF6DC", person_head(80, 66, 22, "#FFCC99",
        '<path d="M76 44 Q84 32 90 42" stroke="#4A2C18" stroke-width="4" stroke-linecap="round" fill="none"/>'
    ) + """
        <path d="M52 132 C52 104 108 104 108 132 Z" fill="#FF9600"/>
        <circle cx="80" cy="116" r="8" fill="#FFC800"/>
    """),
    "dog": ("#FFF2DF", """
        <ellipse cx="80" cy="108" rx="28" ry="22" fill="#D98A3C"/>
        <ellipse cx="80" cy="112" rx="16" ry="14" fill="#FFE0B5"/>
        <path d="M44 56 C32 58 32 86 46 84 C52 82 54 66 44 56 Z" fill="#9E5B1B"/>
        <path d="M116 56 C128 58 128 86 114 84 C108 82 106 66 116 56 Z" fill="#9E5B1B"/>
        <circle cx="80" cy="68" r="26" fill="#D98A3C"/>
        <ellipse cx="80" cy="76" rx="14" ry="11" fill="#FFE0B5"/>
        <circle cx="70" cy="62" r="3.5" fill="#2B2B2B"/>
        <circle cx="90" cy="62" r="3.5" fill="#2B2B2B"/>
        <ellipse cx="80" cy="72" rx="5.5" ry="4" fill="#2B2B2B"/>
        <path d="M76 80 Q80 88 84 80" fill="#FF6B81"/>
        <rect x="62" y="88" width="36" height="7" rx="3.5" fill="#FF4B4B"/>
        <circle cx="80" cy="96" r="4" fill="#FFC800"/>
    """),
    "cat": ("#FFF0E5", """
        <path d="M104 116 Q128 112 124 90" stroke="#FF9600" stroke-width="9" stroke-linecap="round" fill="none"/>
        <ellipse cx="80" cy="108" rx="26" ry="22" fill="#FF9600"/>
        <ellipse cx="80" cy="112" rx="14" ry="13" fill="#FFF3E0"/>
        <polygon points="54,58 48,30 72,46" fill="#FF9600"/>
        <polygon points="56,54 52,36 68,46" fill="#FFB8B8"/>
        <polygon points="106,58 112,30 88,46" fill="#FF9600"/>
        <polygon points="104,54 108,36 92,46" fill="#FFB8B8"/>
        <circle cx="80" cy="68" r="25" fill="#FF9600"/>
        <circle cx="70" cy="64" r="3.5" fill="#2B2B2B"/>
        <circle cx="90" cy="64" r="3.5" fill="#2B2B2B"/>
        <polygon points="80,73 76,69 84,69" fill="#FF6B81"/>
        <path d="M74 77 Q80 81 86 77" stroke="#2B2B2B" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <line x1="44" y1="68" x2="60" y2="70" stroke="#2B2B2B" stroke-width="2" stroke-linecap="round"/>
        <line x1="44" y1="75" x2="60" y2="74" stroke="#2B2B2B" stroke-width="2" stroke-linecap="round"/>
        <line x1="116" y1="68" x2="100" y2="70" stroke="#2B2B2B" stroke-width="2" stroke-linecap="round"/>
        <line x1="116" y1="75" x2="100" y2="74" stroke="#2B2B2B" stroke-width="2" stroke-linecap="round"/>
    """),
    "donkey": ("#EDF2F7", """
        <ellipse cx="58" cy="40" rx="8" ry="22" transform="rotate(-14 58 40)" fill="#8D99AE"/>
        <ellipse cx="58" cy="40" rx="4" ry="15" transform="rotate(-14 58 40)" fill="#F4A7B9"/>
        <ellipse cx="102" cy="40" rx="8" ry="22" transform="rotate(14 102 40)" fill="#8D99AE"/>
        <ellipse cx="102" cy="40" rx="4" ry="15" transform="rotate(14 102 40)" fill="#F4A7B9"/>
        <ellipse cx="80" cy="112" rx="26" ry="20" fill="#8D99AE"/>
        <rect x="58" y="52" width="44" height="50" rx="22" fill="#8D99AE"/>
        <ellipse cx="80" cy="88" rx="18" ry="14" fill="#D9E2EC"/>
        <circle cx="70" cy="68" r="3.2" fill="#2B2B2B"/>
        <circle cx="90" cy="68" r="3.2" fill="#2B2B2B"/>
        <circle cx="74" cy="86" r="2.5" fill="#4A5568"/>
        <circle cx="86" cy="86" r="2.5" fill="#4A5568"/>
    """),
    "horse": ("#FFF1E0", """
        <path d="M56 38 Q44 58 48 92" stroke="#5C3317" stroke-width="12" stroke-linecap="round"/>
        <polygon points="62,48 56,28 72,42" fill="#B5651D"/>
        <polygon points="98,48 104,28 88,42" fill="#B5651D"/>
        <ellipse cx="82" cy="112" rx="28" ry="20" fill="#B5651D"/>
        <rect x="58" y="46" width="44" height="54" rx="22" fill="#B5651D"/>
        <ellipse cx="80" cy="60" rx="5" ry="10" fill="#FFF"/>
        <ellipse cx="80" cy="88" rx="17" ry="13" fill="#E6A972"/>
        <circle cx="69" cy="64" r="3.2" fill="#2B2B2B"/>
        <circle cx="91" cy="64" r="3.2" fill="#2B2B2B"/>
        <circle cx="74" cy="87" r="2.4" fill="#5C3317"/>
        <circle cx="86" cy="87" r="2.4" fill="#5C3317"/>
    """),
    "camel": ("#FFF6D6", """
        <circle cx="122" cy="40" r="12" fill="#FFC800"/>
        <path d="M62 96 C62 60 98 60 98 96 Z" fill="#D99B4E"/>
        <ellipse cx="84" cy="100" rx="34" ry="18" fill="#E6AD62"/>
        <path d="M54 96 C44 96 42 74 42 54" stroke="#E6AD62" stroke-width="14" stroke-linecap="round" fill="none"/>
        <ellipse cx="38" cy="50" rx="14" ry="10" fill="#E6AD62"/>
        <circle cx="35" cy="48" r="2.5" fill="#2B2B2B"/>
        <rect x="60" y="112" width="7" height="22" rx="3.5" fill="#C4883C"/>
        <rect x="74" y="112" width="7" height="22" rx="3.5" fill="#C4883C"/>
        <rect x="94" y="112" width="7" height="22" rx="3.5" fill="#C4883C"/>
        <rect x="108" y="112" width="7" height="22" rx="3.5" fill="#C4883C"/>
    """),
    "rooster": ("#FFF0E8", """
        <path d="M96 90 C118 72 130 92 118 112" stroke="#1CB0F6" stroke-width="10" stroke-linecap="round" fill="none"/>
        <path d="M96 96 C116 84 124 100 112 116" stroke="#58CC02" stroke-width="8" stroke-linecap="round" fill="none"/>
        <ellipse cx="76" cy="96" rx="26" ry="22" fill="#FF9600"/>
        <circle cx="62" cy="64" r="16" fill="#FF9600"/>
        <path d="M54 48 C54 38 62 38 64 46 C66 36 74 38 72 48 C78 42 82 50 74 54 Z" fill="#FF4B4B"/>
        <polygon points="46,64 34,68 46,73" fill="#FFC800"/>
        <ellipse cx="47" cy="76" rx="4" ry="6" fill="#FF4B4B"/>
        <circle cx="58" cy="62" r="2.8" fill="#2B2B2B"/>
        <line x1="70" y1="118" x2="70" y2="132" stroke="#E5A800" stroke-width="4" stroke-linecap="round"/>
        <line x1="84" y1="118" x2="84" y2="132" stroke="#E5A800" stroke-width="4" stroke-linecap="round"/>
    """),
    "handkerchief": ("#E5F7FF", """
        <path d="M40 52 L80 34 L120 52 L108 122 L52 122 Z" fill="#FFFFFF" stroke="#84D8FF" stroke-width="4" stroke-linejoin="round"/>
        <path d="M48 60 L80 46 L112 60" stroke="#1CB0F6" stroke-width="3" stroke-dasharray="5 5" fill="none"/>
        <circle cx="80" cy="86" r="10" fill="#84D8FF" opacity="0.5"/>
    """),
    "stone": ("#EEF2F5", """
        <path d="M34 106 C30 78 52 54 82 54 C112 54 130 76 126 106 C122 124 38 124 34 106 Z" fill="#8D99AE"/>
        <path d="M48 78 C58 64 84 62 100 72" stroke="#B8C4D0" stroke-width="6" stroke-linecap="round"/>
        <circle cx="114" cy="116" r="12" fill="#6C7A89"/>
    """),
    "sugar": ("#FFF5F7", """
        <rect x="44" y="76" width="34" height="34" rx="7" fill="#FFFFFF" stroke="#D9E2EC" stroke-width="3"/>
        <rect x="82" y="78" width="34" height="34" rx="7" fill="#FFFFFF" stroke="#D9E2EC" stroke-width="3"/>
        <rect x="62" y="46" width="34" height="34" rx="7" fill="#FFFFFF" stroke="#D9E2EC" stroke-width="3"/>
        <circle cx="56" cy="90" r="2" fill="#CBD5E1"/>
        <circle cx="76" cy="60" r="2" fill="#CBD5E1"/>
        <circle cx="98" cy="94" r="2" fill="#CBD5E1"/>
    """),
    "milk": ("#E3F6FF", """
        <polygon points="52,52 66,34 94,34 108,52" fill="#1CB0F6"/>
        <rect x="64" y="26" width="32" height="10" rx="3" fill="#FFFFFF"/>
        <rect x="52" y="52" width="56" height="76" rx="8" fill="#FFFFFF" stroke="#CFE8F6" stroke-width="3"/>
        <rect x="52" y="74" width="56" height="28" fill="#1CB0F6"/>
        <circle cx="80" cy="88" r="9" fill="#FFFFFF"/>
    """),
    "water": ("#E0F5FF", """
        <path d="M80 28 C80 28 42 74 42 100 C42 121 59 134 80 134 C101 134 118 121 118 100 C118 74 80 28 80 28 Z" fill="#1CB0F6"/>
        <path d="M58 96 C56 110 64 120 74 122" stroke="#84D8FF" stroke-width="6" stroke-linecap="round"/>
        <circle cx="68" cy="94" r="3" fill="#0B4F6C"/>
        <circle cx="92" cy="94" r="3" fill="#0B4F6C"/>
        <path d="M74 104 Q80 110 86 104" stroke="#0B4F6C" stroke-width="2.6" stroke-linecap="round" fill="none"/>
    """),
    "apple": ("#FFEAEA", """
        <path d="M80 48 C80 36 88 28 94 26" stroke="#7C4D25" stroke-width="5" stroke-linecap="round"/>
        <path d="M82 40 C94 30 110 34 106 46 C96 52 86 46 82 40 Z" fill="#58CC02"/>
        <path d="M80 50 C62 44 40 58 40 86 C40 114 60 132 74 132 C80 132 80 128 86 132 C100 132 120 114 120 86 C120 58 98 44 80 50 Z" fill="#FF4B4B"/>
        <path d="M54 72 C50 86 54 102 62 110" stroke="#FF8A8A" stroke-width="6" stroke-linecap="round"/>
    """),
    "shop": ("#FFF3E0", """
        <rect x="34" y="64" width="92" height="68" rx="6" fill="#FFF8EE" stroke="#E2D5C3" stroke-width="2"/>
        <rect x="68" y="92" width="24" height="40" rx="4" fill="#1CB0F6"/>
        <rect x="42" y="88" width="20" height="22" rx="4" fill="#84D8FF"/>
        <rect x="98" y="88" width="20" height="22" rx="4" fill="#84D8FF"/>
        <path d="M26 68 L36 44 H124 L134 68 Z" fill="#FF4B4B"/>
        <circle cx="42" cy="68" r="10" fill="#FF4B4B"/>
        <circle cx="62" cy="68" r="10" fill="#FFFFFF"/>
        <circle cx="80" cy="68" r="10" fill="#FF4B4B"/>
        <circle cx="98" cy="68" r="10" fill="#FFFFFF"/>
        <circle cx="118" cy="68" r="10" fill="#FF4B4B"/>
    """),
    "paper": ("#F0F7FF", """
        <path d="M44 28 H98 L118 48 V128 C118 131 115 134 112 134 H44 C41 134 38 131 38 128 V34 C38 31 41 28 44 28 Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3"/>
        <path d="M98 28 V48 H118 Z" fill="#E2E8F0"/>
        <rect x="52" y="60" width="52" height="6" rx="3" fill="#1CB0F6"/>
        <rect x="52" y="76" width="52" height="6" rx="3" fill="#94A3B8"/>
        <rect x="52" y="92" width="40" height="6" rx="3" fill="#94A3B8"/>
        <rect x="52" y="108" width="46" height="6" rx="3" fill="#94A3B8"/>
    """),
    "car": ("#FFEBEB", """
        <path d="M36 86 L50 56 C53 50 58 48 66 48 H96 C104 48 109 50 112 56 L124 86 Z" fill="#FF4B4B"/>
        <path d="M54 60 H78 V82 H44 Z" fill="#84D8FF"/>
        <path d="M84 60 H106 L116 82 H84 Z" fill="#84D8FF"/>
        <rect x="24" y="82" width="112" height="32" rx="12" fill="#FF4B4B"/>
        <rect x="126" y="90" width="10" height="10" rx="4" fill="#FFC800"/>
        <circle cx="52" cy="116" r="15" fill="#2B2B2B"/>
        <circle cx="52" cy="116" r="7" fill="#E2E8F0"/>
        <circle cx="110" cy="116" r="15" fill="#2B2B2B"/>
        <circle cx="110" cy="116" r="7" fill="#E2E8F0"/>
    """),
    "bag": ("#FFF2E2", """
        <path d="M62 54 V42 C62 32 98 32 98 42 V54" stroke="#8C4A19" stroke-width="7" stroke-linecap="round" fill="none"/>
        <rect x="34" y="52" width="92" height="76" rx="14" fill="#C87D3B"/>
        <path d="M34 62 C34 54 126 54 126 62 V86 C126 92 34 92 34 86 Z" fill="#E08E45"/>
        <rect x="72" y="80" width="16" height="18" rx="4" fill="#FFC800"/>
    """),
    "school": ("#FFF3E6", """
        <rect x="76" y="18" width="4" height="22" fill="#4B5563"/>
        <polygon points="80,18 100,24 80,30" fill="#1CB0F6"/>
        <polygon points="34,70 80,36 126,70" fill="#FF4B4B"/>
        <rect x="38" y="70" width="84" height="62" rx="4" fill="#FFF7E6"/>
        <circle cx="80" cy="60" r="11" fill="#FFFFFF" stroke="#C87D3B" stroke-width="3"/>
        <path d="M80 54 V60 L85 63" stroke="#2B2B2B" stroke-width="2.2" stroke-linecap="round"/>
        <rect x="70" y="98" width="20" height="34" rx="4" fill="#1CB0F6"/>
        <rect x="46" y="82" width="16" height="16" rx="3" fill="#84D8FF"/>
        <rect x="98" y="82" width="16" height="16" rx="3" fill="#84D8FF"/>
    """),
    "clock": ("#E5F7FF", """
        <circle cx="80" cy="82" r="48" fill="#1CB0F6"/>
        <circle cx="80" cy="82" r="38" fill="#FFFFFF"/>
        <circle cx="80" cy="48" r="2.5" fill="#2B2B2B"/>
        <circle cx="114" cy="82" r="2.5" fill="#2B2B2B"/>
        <circle cx="80" cy="116" r="2.5" fill="#2B2B2B"/>
        <circle cx="46" cy="82" r="2.5" fill="#2B2B2B"/>
        <path d="M80 82 V58" stroke="#2B2B2B" stroke-width="5" stroke-linecap="round"/>
        <path d="M80 82 L100 92" stroke="#FF4B4B" stroke-width="5" stroke-linecap="round"/>
        <circle cx="80" cy="82" r="5" fill="#FFC800"/>
    """),
    "flower": ("#FFEFF7", """
        <path d="M80 86 V132" stroke="#58CC02" stroke-width="8" stroke-linecap="round"/>
        <path d="M80 112 C98 104 108 114 96 122 C88 126 80 118 80 112 Z" fill="#58CC02"/>
        <circle cx="80" cy="44" r="16" fill="#FF6B9E"/>
        <circle cx="102" cy="60" r="16" fill="#FF6B9E"/>
        <circle cx="94" cy="84" r="16" fill="#FF6B9E"/>
        <circle cx="66" cy="84" r="16" fill="#FF6B9E"/>
        <circle cx="58" cy="60" r="16" fill="#FF6B9E"/>
        <circle cx="80" cy="66" r="16" fill="#FFC800"/>
    """),
    "fish": ("#E0F7FF", """
        <polygon points="112,82 138,58 134,82 138,106" fill="#FF9600"/>
        <ellipse cx="76" cy="82" rx="44" ry="28" fill="#1CB0F6"/>
        <path d="M70 54 Q84 40 94 56" fill="#FF9600"/>
        <circle cx="50" cy="76" r="5" fill="#FFFFFF"/>
        <circle cx="49" cy="76" r="2.6" fill="#2B2B2B"/>
        <path d="M72 70 C80 76 80 88 72 94" stroke="#84D8FF" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M88 70 C96 76 96 88 88 94" stroke="#84D8FF" stroke-width="4" stroke-linecap="round" fill="none"/>
    """),
    "tree": ("#E8F9E4", """
        <rect x="70" y="88" width="20" height="46" rx="5" fill="#8B5A2B"/>
        <circle cx="80" cy="54" r="30" fill="#58CC02"/>
        <circle cx="56" cy="74" r="24" fill="#58CC02"/>
        <circle cx="104" cy="74" r="24" fill="#58CC02"/>
        <circle cx="70" cy="46" r="6" fill="#FF4B4B"/>
        <circle cx="96" cy="64" r="6" fill="#FF4B4B"/>
        <circle cx="60" cy="76" r="6" fill="#FF4B4B"/>
    """),
    "kitchen": ("#FFF5E5", """
        <rect x="34" y="66" width="92" height="66" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3"/>
        <rect x="34" y="66" width="92" height="14" rx="4" fill="#E2E8F0"/>
        <circle cx="52" cy="73" r="3" fill="#FF4B4B"/>
        <circle cx="66" cy="73" r="3" fill="#2B2B2B"/>
        <circle cx="94" cy="73" r="3" fill="#2B2B2B"/>
        <rect x="48" y="88" width="64" height="32" rx="6" fill="#334155"/>
        <rect x="54" y="44" width="36" height="22" rx="4" fill="#FF4B4B"/>
        <rect x="50" y="40" width="44" height="6" rx="3" fill="#D93838"/>
    """),
    "bathroom": ("#E3F7FF", """
        <path d="M40 56 V36 C40 28 56 28 56 36" stroke="#64748B" stroke-width="5" stroke-linecap="round" fill="none"/>
        <ellipse cx="56" cy="38" rx="8" ry="4" fill="#94A3B8"/>
        <path d="M28 84 H132 L124 122 C122 128 116 132 108 132 H52 C44 132 38 128 36 122 Z" fill="#FFFFFF" stroke="#93C5FD" stroke-width="3"/>
        <circle cx="54" cy="76" r="8" fill="#84D8FF"/>
        <circle cx="70" cy="72" r="10" fill="#84D8FF"/>
        <circle cx="88" cy="76" r="9" fill="#84D8FF"/>
        <circle cx="106" cy="74" r="8" fill="#84D8FF"/>
    """),
    "classroom": ("#E8F8E8", """
        <rect x="28" y="34" width="104" height="64" rx="8" fill="#2E6F40" stroke="#C87D3B" stroke-width="6"/>
        <text x="80" y="75" text-anchor="middle" font-size="28" fill="#FFFFFF" font-family="serif">الْعَرَبِيَّة</text>
        <rect x="44" y="112" width="72" height="18" rx="4" fill="#C87D3B"/>
    """),
    "university": ("#EDE9FE", """
        <polygon points="24,62 80,30 136,62" fill="#6D28D9"/>
        <rect x="30" y="62" width="100" height="8" rx="2" fill="#8B5CF6"/>
        <rect x="40" y="70" width="12" height="52" rx="3" fill="#EDE9FE" stroke="#8B5CF6" stroke-width="2"/>
        <rect x="64" y="70" width="12" height="52" rx="3" fill="#EDE9FE" stroke="#8B5CF6" stroke-width="2"/>
        <rect x="84" y="70" width="12" height="52" rx="3" fill="#EDE9FE" stroke="#8B5CF6" stroke-width="2"/>
        <rect x="108" y="70" width="12" height="52" rx="3" fill="#EDE9FE" stroke="#8B5CF6" stroke-width="2"/>
        <rect x="26" y="122" width="108" height="10" rx="4" fill="#6D28D9"/>
    """),
    "window": ("#E3F6FF", """
        <rect x="36" y="30" width="88" height="100" rx="10" fill="#C87D3B"/>
        <rect x="44" y="38" width="32" height="38" rx="3" fill="#84D8FF"/>
        <rect x="84" y="38" width="32" height="38" rx="3" fill="#84D8FF"/>
        <rect x="44" y="84" width="32" height="38" rx="3" fill="#84D8FF"/>
        <rect x="84" y="84" width="32" height="38" rx="3" fill="#84D8FF"/>
        <circle cx="100" cy="54" r="8" fill="#FFC800"/>
    """),
    "tea": ("#FFF3E0", """
        <path d="M68 38 Q74 28 68 20 M88 38 Q94 28 88 20" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M104 66 H118 C126 66 126 94 116 94 H104" stroke="#58CC02" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M44 56 H108 L100 112 C98 120 90 124 76 124 C62 124 54 120 52 112 Z" fill="#58CC02"/>
        <ellipse cx="76" cy="56" rx="32" ry="8" fill="#C2410C"/>
        <ellipse cx="76" cy="126" rx="44" ry="7" fill="#89E219"/>
    """),
    "coffee": ("#F5EBE6", """
        <path d="M68 38 Q74 28 68 20 M88 38 Q94 28 88 20" stroke="#A8A29E" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M106 66 H118 C126 66 126 94 116 94 H104" stroke="#78350F" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M44 56 H108 L100 114 C98 122 90 126 76 126 C62 126 54 122 52 114 Z" fill="#92400E"/>
        <ellipse cx="76" cy="56" rx="32" ry="8" fill="#451A03"/>
    """),
    "cow": ("#F0FDF4", """
        <ellipse cx="50" cy="52" rx="10" ry="6" fill="#2B2B2B"/>
        <ellipse cx="110" cy="52" rx="10" ry="6" fill="#2B2B2B"/>
        <path d="M60 44 Q56 30 48 34" stroke="#FDE68A" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M100 44 Q104 30 112 34" stroke="#FDE68A" stroke-width="6" stroke-linecap="round" fill="none"/>
        <rect x="52" y="44" width="56" height="56" rx="24" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <path d="M54 52 C68 50 72 66 54 68 Z" fill="#2B2B2B"/>
        <path d="M106 58 C92 56 92 74 106 74 Z" fill="#2B2B2B"/>
        <ellipse cx="80" cy="96" rx="28" ry="18" fill="#FBB6CE"/>
        <circle cx="68" cy="66" r="3.5" fill="#2B2B2B"/>
        <circle cx="92" cy="66" r="3.5" fill="#2B2B2B"/>
        <circle cx="70" cy="96" r="3.5" fill="#97266D"/>
        <circle cx="90" cy="96" r="3.5" fill="#97266D"/>
    """),
    "bike": ("#E3F7FF", """
        <circle cx="46" cy="104" r="22" stroke="#2B2B2B" stroke-width="6" fill="#FFF"/>
        <circle cx="114" cy="104" r="22" stroke="#2B2B2B" stroke-width="6" fill="#FFF"/>
        <path d="M46 104 L70 72 H104 L80 104 Z" stroke="#FF4B4B" stroke-width="6" stroke-linejoin="round" fill="none"/>
        <path d="M114 104 L100 56 H112" stroke="#FF4B4B" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <rect x="58" y="64" width="20" height="7" rx="3.5" fill="#2B2B2B"/>
    """),
    "egg": ("#FFF8E1", """
        <path d="M80 30 C54 30 42 68 42 96 C42 120 58 134 80 134 C102 134 118 120 118 96 C118 68 106 30 80 30 Z" fill="#FFFDF7" stroke="#F3D9B1" stroke-width="3"/>
        <circle cx="80" cy="92" r="18" fill="#FFC800"/>
        <circle cx="74" cy="86" r="5" fill="#FFF" opacity="0.7"/>
    """),
    "chicken": ("#FFF5E4", """
        <ellipse cx="82" cy="96" rx="32" ry="26" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
        <circle cx="60" cy="64" r="18" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
        <path d="M54 46 C54 38 62 40 62 46 C66 38 72 42 68 48 Z" fill="#FF4B4B"/>
        <polygon points="42,64 32,68 42,72" fill="#FFC800"/>
        <circle cx="55" cy="62" r="3" fill="#2B2B2B"/>
        <path d="M72 92 C72 106 96 106 96 92" fill="#F1F5F9"/>
    """),
    "duck": ("#E3F7FF", """
        <ellipse cx="84" cy="98" rx="34" ry="22" fill="#FFC800"/>
        <circle cx="58" cy="62" r="19" fill="#FFC800"/>
        <path d="M40 60 H26 C24 64 26 70 34 70 H42 Z" fill="#FF9600"/>
        <circle cx="52" cy="58" r="3.2" fill="#2B2B2B"/>
        <path d="M74 94 C86 86 102 92 96 104" fill="#E5A800"/>
    """),
    "hospital": ("#FFEFEF", """
        <rect x="36" y="34" width="88" height="98" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3"/>
        <rect x="74" y="44" width="12" height="32" rx="3" fill="#FF4B4B"/>
        <rect x="64" y="54" width="32" height="12" rx="3" fill="#FF4B4B"/>
        <rect x="68" y="102" width="24" height="30" rx="4" fill="#1CB0F6"/>
        <rect x="46" y="82" width="16" height="14" rx="3" fill="#84D8FF"/>
        <rect x="98" y="82" width="16" height="14" rx="3" fill="#84D8FF"/>
    """),
    "knife": ("#F1F5F9", """
        <g transform="rotate(-35 80 80)">
          <path d="M72 24 C86 28 92 52 92 86 H72 Z" fill="#CBD5E1" stroke="#94A3B8" stroke-width="2"/>
          <rect x="72" y="86" width="16" height="44" rx="6" fill="#7C4D25"/>
          <circle cx="80" cy="98" r="2.5" fill="#E2E8F0"/>
          <circle cx="80" cy="114" r="2.5" fill="#E2E8F0"/>
        </g>
    """),
    "fruit": ("#FFF3E2", """
        <circle cx="60" cy="94" r="24" fill="#FF4B4B"/>
        <path d="M60 70 Q66 60 72 64" stroke="#58CC02" stroke-width="5" stroke-linecap="round"/>
        <circle cx="98" cy="98" r="22" fill="#FF9600"/>
        <path d="M56 54 C76 40 112 50 118 76 C100 66 76 62 56 54 Z" fill="#FFC800"/>
    """),
    "bird": ("#E3F7FF", """
        <ellipse cx="82" cy="88" rx="28" ry="24" fill="#1CB0F6"/>
        <circle cx="64" cy="66" r="18" fill="#1CB0F6"/>
        <polygon points="46,66 34,70 46,74" fill="#FFC800"/>
        <circle cx="58" cy="64" r="3.2" fill="#2B2B2B"/>
        <path d="M74 84 C88 76 102 86 92 98 Z" fill="#0F7DB3"/>
    """),
    "city": ("#E5F4FF", """
        <rect x="28" y="56" width="32" height="76" rx="4" fill="#1CB0F6"/>
        <rect x="64" y="34" width="36" height="98" rx="4" fill="#6366F1"/>
        <rect x="104" y="68" width="28" height="64" rx="4" fill="#FF9600"/>
        <rect x="72" y="46" width="8" height="8" rx="1.5" fill="#FFC800"/>
        <rect x="84" y="46" width="8" height="8" rx="1.5" fill="#FFC800"/>
        <rect x="72" y="62" width="8" height="8" rx="1.5" fill="#FFC800"/>
        <rect x="84" y="62" width="8" height="8" rx="1.5" fill="#FFC800"/>
        <rect x="36" y="68" width="16" height="8" rx="1.5" fill="#FFF"/>
        <rect x="36" y="84" width="16" height="8" rx="1.5" fill="#FFF"/>
    """),
    "cup": ("#FFF3E6", """
        <path d="M104 68 H118 C126 68 126 94 116 94 H104" stroke="#1CB0F6" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M44 58 H108 L100 110 C98 118 90 122 76 122 C62 122 54 118 52 110 Z" fill="#1CB0F6"/>
        <ellipse cx="76" cy="124" rx="42" ry="7" fill="#84D8FF"/>
    """),
    "library": ("#FFF4E4", """
        <rect x="28" y="36" width="104" height="96" rx="8" fill="#8B5A2B"/>
        <rect x="36" y="44" width="88" height="36" rx="4" fill="#5C3A1B"/>
        <rect x="36" y="88" width="88" height="36" rx="4" fill="#5C3A1B"/>
        <rect x="42" y="48" width="12" height="32" rx="2" fill="#FF4B4B"/>
        <rect x="56" y="48" width="12" height="32" rx="2" fill="#1CB0F6"/>
        <rect x="70" y="48" width="12" height="32" rx="2" fill="#58CC02"/>
        <rect x="84" y="48" width="12" height="32" rx="2" fill="#FFC800"/>
        <rect x="42" y="92" width="14" height="32" rx="2" fill="#CE82FF"/>
        <rect x="58" y="92" width="12" height="32" rx="2" fill="#FF9600"/>
        <rect x="72" y="92" width="14" height="32" rx="2" fill="#1CB0F6"/>
    """),
    "room": ("#FFF5E8", """
        <rect x="30" y="36" width="100" height="94" rx="8" fill="#FFFDF9" stroke="#D6C7B2" stroke-width="3"/>
        <rect x="42" y="48" width="28" height="28" rx="4" fill="#84D8FF" stroke="#C87D3B" stroke-width="3"/>
        <path d="M98 70 L114 70 L120 88 H92 Z" fill="#FFC800"/>
        <line x1="106" y1="88" x2="106" y2="124" stroke="#78350F" stroke-width="4"/>
        <rect x="40" y="98" width="52" height="26" rx="6" fill="#FF4B4B"/>
    """),
    "sky": ("#DDF4FF", """
        <circle cx="114" cy="48" r="18" fill="#FFC800"/>
        <circle cx="58" cy="88" r="20" fill="#FFFFFF"/>
        <circle cx="80" cy="80" r="24" fill="#FFFFFF"/>
        <circle cx="102" cy="90" r="18" fill="#FFFFFF"/>
        <rect x="56" y="88" width="48" height="20" fill="#FFFFFF"/>
    """),
    "fridge": ("#E3F6FF", """
        <rect x="46" y="26" width="68" height="106" rx="10" fill="#84D8FF" stroke="#1CB0F6" stroke-width="3"/>
        <line x1="46" y1="68" x2="114" y2="68" stroke="#1CB0F6" stroke-width="3"/>
        <rect x="54" y="42" width="5" height="16" rx="2.5" fill="#FFFFFF"/>
        <rect x="54" y="78" width="5" height="24" rx="2.5" fill="#FFFFFF"/>
    """),
    "spoon": ("#F1F5F9", """
        <g transform="rotate(-35 80 80)">
          <ellipse cx="80" cy="46" rx="18" ry="24" fill="#CBD5E1" stroke="#94A3B8" stroke-width="2"/>
          <rect x="75" y="68" width="10" height="62" rx="5" fill="#94A3B8"/>
        </g>
    """),
    "sun": ("#FFF8D6", """
        <g stroke="#FF9600" stroke-width="6" stroke-linecap="round">
          <line x1="80" y1="20" x2="80" y2="30"/><line x1="80" y1="130" x2="80" y2="140"/>
          <line x1="20" y1="80" x2="30" y2="80"/><line x1="130" y1="80" x2="140" y2="80"/>
          <line x1="38" y1="38" x2="45" y2="45"/><line x1="115" y1="115" x2="122" y2="122"/>
          <line x1="122" y1="38" x2="115" y2="45"/><line x1="45" y1="115" x2="38" y2="122"/>
        </g>
        <circle cx="80" cy="80" r="36" fill="#FFC800"/>
        <circle cx="68" cy="76" r="3.5" fill="#3B2A00"/>
        <circle cx="92" cy="76" r="3.5" fill="#3B2A00"/>
        <path d="M72 88 Q80 95 88 88" stroke="#3B2A00" stroke-width="3" stroke-linecap="round" fill="none"/>
    """),
    "moon": ("#1A2B4C", """
        <circle cx="42" cy="44" r="2.5" fill="#FFF"/>
        <circle cx="122" cy="56" r="3" fill="#FFC800"/>
        <circle cx="112" cy="112" r="2" fill="#FFF"/>
        <path d="M96 32 C64 32 42 56 42 84 C42 112 64 132 96 132 C76 122 68 104 68 84 C68 64 76 42 96 32 Z" fill="#FFC800"/>
    """),
    "generic": ("#E5F6FF", """
        <rect x="36" y="36" width="88" height="88" rx="20" fill="#1CB0F6"/>
        <text x="80" y="96" text-anchor="middle" font-size="48" fill="#FFFFFF" font-family="serif">ع</text>
    """),
}

for name, (bg, svg_body) in ICONS.items():
    ground = "rgba(255,255,255,0.12)" if bg == "#1A2B4C" else "rgba(0,0,0,0.08)"
    (OUT / f"{name}.svg").write_text(wrap(bg, svg_body, ground), encoding="utf-8")

print(f"OK: {len(ICONS)} Duolingo-stijl SVG-illustraties geschreven naar {OUT}")
