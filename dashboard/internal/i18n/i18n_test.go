package i18n

import (
	"testing"
	"time"
)

func TestStatusLabel(t *testing.T) {
	tests := []struct {
		norm string
		en   string
		tr   string
		es   string
		zh   string
	}{
		{"interview", "Interview", "Mülakat", "Entrevista", "面試中"},
		{"offer", "Offer", "Teklif", "Oferta", "已獲 Offer"},
		{"hired", "Hired", "İşe Alındı", "Contratada", "已到職"},
		{"responded", "Responded", "Yanıt Verildi", "Respondida", "已回應"},
		{"applied", "Applied", "Başvuruldu", "Aplicada", "已投遞"},
		{"evaluated", "Evaluated", "Değerlendirildi", "Evaluada", "已評估"},
		{"skip", "SKIP", "Uygun Değil", "OMITIR", "略過"},
		{"rejected", "Rejected", "Reddedildi", "Rechazada", "已拒絕"},
		{"discarded", "Discarded", "İptal Edildi", "Descartada", "已放棄"},
		{"unknown", "unknown", "unknown", "unknown", "unknown"},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.norm, func(t *testing.T) {
			t.Parallel()
			if got := En.StatusLabel(tt.norm); got != tt.en {
				t.Fatalf("En.StatusLabel(%q) = %q, expected %q", tt.norm, got, tt.en)
			}
			if got := Tr.StatusLabel(tt.norm); got != tt.tr {
				t.Fatalf("Tr.StatusLabel(%q) = %q, expected %q", tt.norm, got, tt.tr)
			}
			if got := Es.StatusLabel(tt.norm); got != tt.es {
				t.Fatalf("Es.StatusLabel(%q) = %q, expected %q", tt.norm, got, tt.es)
			}
			if got := ZhTw.StatusLabel(tt.norm); got != tt.zh {
				t.Fatalf("ZhTw.StatusLabel(%q) = %q, expected %q", tt.norm, got, tt.zh)
			}
		})
	}
}

func TestFormatTimeAgo(t *testing.T) {
	// Mock time to ensure deterministic tests
	mockNow := time.Date(2023, 10, 27, 12, 0, 0, 0, time.Local)
	originalNowFunc := NowFunc
	NowFunc = func() time.Time { return mockNow }
	defer func() { NowFunc = originalNowFunc }()

	today := mockNow.Format("2006-01-02")
	yesterday := mockNow.AddDate(0, 0, -1).Format("2006-01-02")
	threeDaysAgo := mockNow.AddDate(0, 0, -3).Format("2006-01-02")
	tomorrow := mockNow.AddDate(0, 0, 1).Format("2006-01-02")

	// English tests
	if got := En.FormatTimeAgo(today); got != "today" {
		t.Errorf("En.FormatTimeAgo(today) = %q; want \"today\"", got)
	}
	if got := En.FormatTimeAgo(yesterday); got != "yesterday" {
		t.Errorf("En.FormatTimeAgo(yesterday) = %q; want \"yesterday\"", got)
	}
	if got := En.FormatTimeAgo(threeDaysAgo); got != "3d ago" {
		t.Errorf("En.FormatTimeAgo(3d ago) = %q; want \"3d ago\"", got)
	}
	if got := En.FormatTimeAgo(tomorrow); got != "today" {
		t.Errorf("En.FormatTimeAgo(tomorrow) = %q; want \"today\"", got)
	}
	if got := En.FormatTimeAgo("not-a-date"); got != "not-a-date" {
		t.Errorf("En.FormatTimeAgo(invalid) = %q; want \"not-a-date\"", got)
	}

	// Turkish tests
	if got := Tr.FormatTimeAgo(today); got != "bugün" {
		t.Errorf("Tr.FormatTimeAgo(today) = %q; want \"bugün\"", got)
	}
	if got := Tr.FormatTimeAgo(yesterday); got != "dün" {
		t.Errorf("Tr.FormatTimeAgo(yesterday) = %q; want \"dün\"", got)
	}
	if got := Tr.FormatTimeAgo(threeDaysAgo); got != "3 gün önce" {
		t.Errorf("Tr.FormatTimeAgo(3d ago) = %q; want \"3 gün önce\"", got)
	}
	if got := Tr.FormatTimeAgo(tomorrow); got != "bugün" {
		t.Errorf("Tr.FormatTimeAgo(tomorrow) = %q; want \"bugün\"", got)
	}
	if got := Tr.FormatTimeAgo("not-a-date"); got != "not-a-date" {
		t.Errorf("Tr.FormatTimeAgo(invalid) = %q; want \"not-a-date\"", got)
	}

	// Spanish tests
	if got := Es.FormatTimeAgo(today); got != "hoy" {
		t.Errorf("Es.FormatTimeAgo(today) = %q; want \"hoy\"", got)
	}
	if got := Es.FormatTimeAgo(yesterday); got != "ayer" {
		t.Errorf("Es.FormatTimeAgo(yesterday) = %q; want \"ayer\"", got)
	}
	if got := Es.FormatTimeAgo(threeDaysAgo); got != "hace 3d" {
		t.Errorf("Es.FormatTimeAgo(3d ago) = %q; want \"hace 3d\"", got)
	}
	if got := Es.FormatTimeAgo(tomorrow); got != "hoy" {
		t.Errorf("Es.FormatTimeAgo(tomorrow) = %q; want \"hoy\"", got)
	}
	if got := Es.FormatTimeAgo("not-a-date"); got != "not-a-date" {
		t.Errorf("Es.FormatTimeAgo(invalid) = %q; want \"not-a-date\"", got)
	}

	// Traditional Chinese tests
	if got := ZhTw.FormatTimeAgo(today); got != "今天" {
		t.Errorf("ZhTw.FormatTimeAgo(today) = %q; want \"今天\"", got)
	}
	if got := ZhTw.FormatTimeAgo(yesterday); got != "昨天" {
		t.Errorf("ZhTw.FormatTimeAgo(yesterday) = %q; want \"昨天\"", got)
	}
	if got := ZhTw.FormatTimeAgo(threeDaysAgo); got != "3 天前" {
		t.Errorf("ZhTw.FormatTimeAgo(3d ago) = %q; want \"3 天前\"", got)
	}
	if got := ZhTw.FormatTimeAgo(tomorrow); got != "今天" {
		t.Errorf("ZhTw.FormatTimeAgo(tomorrow) = %q; want \"今天\"", got)
	}
	if got := ZhTw.FormatTimeAgo("not-a-date"); got != "not-a-date" {
		t.Errorf("ZhTw.FormatTimeAgo(invalid) = %q; want \"not-a-date\"", got)
	}
}

func TestRuntimeLanguageManagement(t *testing.T) {
	// Reset to En initially
	Current = &En

	if got := GetLang(); got != "en" {
		t.Errorf("initial GetLang() = %q; want \"en\"", got)
	}

	SetLang("tr")
	if Current != &Tr || GetLang() != "tr" {
		t.Errorf("after SetLang(\"tr\"), GetLang() = %q; want \"tr\"", GetLang())
	}

	SetLang("tr_TR")
	if Current != &Tr || GetLang() != "tr" {
		t.Errorf("after SetLang(\"tr_TR\"), GetLang() = %q; want \"tr\"", GetLang())
	}

	SetLang("es")
	if Current != &Es || GetLang() != "es" {
		t.Errorf("after SetLang(\"es\"), GetLang() = %q; want \"es\"", GetLang())
	}

	SetLang("es_ES")
	if Current != &Es || GetLang() != "es" {
		t.Errorf("after SetLang(\"es_ES\"), GetLang() = %q; want \"es\"", GetLang())
	}

	SetLang("zh-TW")
	if Current != &ZhTw || GetLang() != "zh-TW" {
		t.Errorf("after SetLang(\"zh-TW\"), GetLang() = %q; want \"zh-TW\"", GetLang())
	}

	SetLang("zh_Hant")
	if Current != &ZhTw || GetLang() != "zh-TW" {
		t.Errorf("after SetLang(\"zh_Hant\"), GetLang() = %q; want \"zh-TW\"", GetLang())
	}

	SetLang("en")
	if Current != &En || GetLang() != "en" {
		t.Errorf("after SetLang(\"en\"), GetLang() = %q; want \"en\"", GetLang())
	}

	SetLang("fr") // unknown language falls back to en
	if Current != &En || GetLang() != "en" {
		t.Errorf("after SetLang(\"fr\"), GetLang() = %q; want \"en\"", GetLang())
	}

	// Test ToggleLang cycle: En → Tr → Es → ZhTw → En
	ToggleLang()
	if Current != &Tr || GetLang() != "tr" {
		t.Errorf("after ToggleLang() from En, GetLang() = %q; want \"tr\"", GetLang())
	}

	ToggleLang()
	if Current != &Es || GetLang() != "es" {
		t.Errorf("after ToggleLang() from Tr, GetLang() = %q; want \"es\"", GetLang())
	}

	ToggleLang()
	if Current != &ZhTw || GetLang() != "zh-TW" {
		t.Errorf("after ToggleLang() from Es, GetLang() = %q; want \"zh-TW\"", GetLang())
	}

	ToggleLang()
	if Current != &En || GetLang() != "en" {
		t.Errorf("after ToggleLang() from ZhTw, GetLang() = %q; want \"en\"", GetLang())
	}

	// ToggleLang from an unexpected catalog also lands on En
	Current = &Tr
	SetLang("xx")
	if Current != &En {
		t.Errorf("after SetLang(\"xx\"), expected fallback to En")
	}
}

func TestSortModeLabel(t *testing.T) {
	type sortTestCase struct {
		name string
		mode string
		want string
	}

	enCases := []sortTestCase{
		{name: "score", mode: "score", want: "score"},
		{name: "date", mode: "date", want: "date"},
		{name: "company", mode: "company", want: "company"},
		{name: "status", mode: "status", want: "status"},
		{name: "location", mode: "location", want: "location"},
		{name: "pay", mode: "pay", want: "pay"},
		{name: "last", mode: "last", want: "last"},
		{name: "unknown", mode: "unknown", want: "unknown"},
	}

	for _, tc := range enCases {
		t.Run("En/"+tc.name, func(t *testing.T) {
			if got := En.SortModeLabel(tc.mode); got != tc.want {
				t.Errorf("En.SortModeLabel(%q) = %q; want %q", tc.mode, got, tc.want)
			}
		})
	}

	trCases := []sortTestCase{
		{name: "score", mode: "score", want: "puan"},
		{name: "date", mode: "date", want: "tarih"},
		{name: "company", mode: "company", want: "şirket"},
		{name: "status", mode: "status", want: "durum"},
		{name: "location", mode: "location", want: "konum"},
		{name: "pay", mode: "pay", want: "ücret"},
		{name: "last", mode: "last", want: "son"},
		{name: "unknown", mode: "unknown", want: "unknown"},
	}

	for _, tc := range trCases {
		t.Run("Tr/"+tc.name, func(t *testing.T) {
			if got := Tr.SortModeLabel(tc.mode); got != tc.want {
				t.Errorf("Tr.SortModeLabel(%q) = %q; want %q", tc.mode, got, tc.want)
			}
		})
	}

	esCases := []sortTestCase{
		{name: "score", mode: "score", want: "puntuación"},
		{name: "date", mode: "date", want: "fecha"},
		{name: "company", mode: "company", want: "empresa"},
		{name: "status", mode: "status", want: "estado"},
		{name: "location", mode: "location", want: "ubicación"},
		{name: "pay", mode: "pay", want: "salario"},
		{name: "last", mode: "last", want: "último"},
		{name: "unknown", mode: "unknown", want: "unknown"},
	}

	for _, tc := range esCases {
		t.Run("Es/"+tc.name, func(t *testing.T) {
			if got := Es.SortModeLabel(tc.mode); got != tc.want {
				t.Errorf("Es.SortModeLabel(%q) = %q; want %q", tc.mode, got, tc.want)
			}
		})
	}

	zhCases := []sortTestCase{
		{name: "score", mode: "score", want: "分數"},
		{name: "date", mode: "date", want: "日期"},
		{name: "company", mode: "company", want: "公司"},
		{name: "status", mode: "status", want: "狀態"},
		{name: "location", mode: "location", want: "地點"},
		{name: "pay", mode: "pay", want: "薪資"},
		{name: "last", mode: "last", want: "最後"},
		{name: "unknown", mode: "unknown", want: "unknown"},
	}

	for _, tc := range zhCases {
		t.Run("ZhTw/"+tc.name, func(t *testing.T) {
			if got := ZhTw.SortModeLabel(tc.mode); got != tc.want {
				t.Errorf("ZhTw.SortModeLabel(%q) = %q; want %q", tc.mode, got, tc.want)
			}
		})
	}
}

func TestViewModeLabel(t *testing.T) {
	type viewTestCase struct {
		name string
		mode string
		want string
	}

	enCases := []viewTestCase{
		{name: "grouped", mode: "grouped", want: "grouped"},
		{name: "flat", mode: "flat", want: "flat"},
		{name: "unknown", mode: "unknown", want: "unknown"},
	}

	for _, tc := range enCases {
		t.Run("En/"+tc.name, func(t *testing.T) {
			if got := En.ViewModeLabel(tc.mode); got != tc.want {
				t.Errorf("En.ViewModeLabel(%q) = %q; want %q", tc.mode, got, tc.want)
			}
		})
	}

	trCases := []viewTestCase{
		{name: "grouped", mode: "grouped", want: "gruplu"},
		{name: "flat", mode: "flat", want: "düz"},
		{name: "unknown", mode: "unknown", want: "unknown"},
	}

	for _, tc := range trCases {
		t.Run("Tr/"+tc.name, func(t *testing.T) {
			if got := Tr.ViewModeLabel(tc.mode); got != tc.want {
				t.Errorf("Tr.ViewModeLabel(%q) = %q; want %q", tc.mode, got, tc.want)
			}
		})
	}

	esCases := []viewTestCase{
		{name: "grouped", mode: "grouped", want: "agrupado"},
		{name: "flat", mode: "flat", want: "plano"},
		{name: "unknown", mode: "unknown", want: "unknown"},
	}

	for _, tc := range esCases {
		t.Run("Es/"+tc.name, func(t *testing.T) {
			if got := Es.ViewModeLabel(tc.mode); got != tc.want {
				t.Errorf("Es.ViewModeLabel(%q) = %q; want %q", tc.mode, got, tc.want)
			}
		})
	}

	zhCases := []viewTestCase{
		{name: "grouped", mode: "grouped", want: "分組"},
		{name: "flat", mode: "flat", want: "平鋪"},
		{name: "unknown", mode: "unknown", want: "unknown"},
	}

	for _, tc := range zhCases {
		t.Run("ZhTw/"+tc.name, func(t *testing.T) {
			if got := ZhTw.ViewModeLabel(tc.mode); got != tc.want {
				t.Errorf("ZhTw.ViewModeLabel(%q) = %q; want %q", tc.mode, got, tc.want)
			}
		})
	}
}
