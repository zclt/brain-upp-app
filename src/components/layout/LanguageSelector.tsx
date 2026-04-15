import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const languages = [
  { code: 'en-US', flag: '🇺🇸', label: 'English'    },
  { code: 'pt-BR', flag: '🇧🇷', label: 'Português'  },
  { code: 'es-PE', flag: '🇵🇪', label: 'Español'    },
]

export function LanguageSelector() {
  const { i18n } = useTranslation()
  const current = languages.find((l) => l.code === i18n.language) ?? languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-2 rounded-md hover:bg-accent transition-colors text-base leading-none"
          aria-label={current.label}
        >
          {current.flag}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map(({ code, flag, label }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => i18n.changeLanguage(code)}
            className={`gap-2 cursor-pointer ${i18n.language === code ? 'font-semibold text-primary' : ''}`}
          >
            <span>{flag}</span>
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
