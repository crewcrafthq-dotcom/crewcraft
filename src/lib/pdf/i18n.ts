/**
 * Static label translations for the PDF chrome (ESTIMATE, Labor, Total, …).
 * Deterministic and free — no AI. The contractor's typed content (scope, line
 * items, notes) is translated separately in translate.ts. Server-side use only
 * (imported by the PDF renderer), kept out of the client bundle.
 */

export interface PdfStrings {
  estimate: string;
  invoice: string;
  preparedFor: string;
  scopeOfWork: string;
  labor: string;
  materials: string;
  other: string;
  description: string;
  qty: string;
  unit: string;
  rate: string;
  amount: string;
  subtotal: string;
  tax: string;
  total: string;
  depositDue: string;
  depositReceived: string;
  balanceDue: string;
  notesTerms: string;
  date: string;
  number: string;
  due: string;
  validUntil: string;
  acceptedBy: string;
  signedOn: string;
  paid: string;
  license: string;
  customer: string;
}

export const PDF_STRINGS: Record<string, PdfStrings> = {
  en: {
    estimate: 'Estimate', invoice: 'Invoice', preparedFor: 'Prepared for', scopeOfWork: 'Scope of work',
    labor: 'Labor', materials: 'Materials', other: 'Other', description: 'Description', qty: 'Qty',
    unit: 'Unit', rate: 'Rate', amount: 'Amount', subtotal: 'Subtotal', tax: 'Tax', total: 'Total',
    depositDue: 'Deposit due', depositReceived: 'Deposit received', balanceDue: 'Balance due',
    notesTerms: 'Notes & terms', date: 'Date', number: 'Number', due: 'Due', validUntil: 'Valid until',
    acceptedBy: 'Accepted by', signedOn: 'Signed electronically on', paid: 'Paid', license: 'License', customer: 'Customer',
  },
  ro: {
    estimate: 'Deviz', invoice: 'Factură', preparedFor: 'Pregătit pentru', scopeOfWork: 'Descrierea lucrării',
    labor: 'Manoperă', materials: 'Materiale', other: 'Altele', description: 'Descriere', qty: 'Cant.',
    unit: 'Unitate', rate: 'Preț unitar', amount: 'Sumă', subtotal: 'Subtotal', tax: 'TVA', total: 'Total',
    depositDue: 'Avans de plată', depositReceived: 'Avans primit', balanceDue: 'Rest de plată',
    notesTerms: 'Note și condiții', date: 'Data', number: 'Număr', due: 'Scadență', validUntil: 'Valabil până la',
    acceptedBy: 'Acceptat de', signedOn: 'Semnat electronic la', paid: 'Plătit', license: 'Licență', customer: 'Client',
  },
  es: {
    estimate: 'Presupuesto', invoice: 'Factura', preparedFor: 'Preparado para', scopeOfWork: 'Alcance del trabajo',
    labor: 'Mano de obra', materials: 'Materiales', other: 'Otros', description: 'Descripción', qty: 'Cant.',
    unit: 'Unidad', rate: 'Precio', amount: 'Importe', subtotal: 'Subtotal', tax: 'Impuesto', total: 'Total',
    depositDue: 'Depósito a pagar', depositReceived: 'Depósito recibido', balanceDue: 'Saldo pendiente',
    notesTerms: 'Notas y condiciones', date: 'Fecha', number: 'Número', due: 'Vence', validUntil: 'Válido hasta',
    acceptedBy: 'Aceptado por', signedOn: 'Firmado electrónicamente el', paid: 'Pagado', license: 'Licencia', customer: 'Cliente',
  },
  fr: {
    estimate: 'Devis', invoice: 'Facture', preparedFor: 'Préparé pour', scopeOfWork: 'Description des travaux',
    labor: "Main-d'œuvre", materials: 'Matériaux', other: 'Autres', description: 'Description', qty: 'Qté',
    unit: 'Unité', rate: 'Prix unitaire', amount: 'Montant', subtotal: 'Sous-total', tax: 'TVA', total: 'Total',
    depositDue: 'Acompte à payer', depositReceived: 'Acompte reçu', balanceDue: 'Solde dû',
    notesTerms: 'Notes et conditions', date: 'Date', number: 'Numéro', due: 'Échéance', validUntil: "Valable jusqu'au",
    acceptedBy: 'Accepté par', signedOn: 'Signé électroniquement le', paid: 'Payé', license: 'Licence', customer: 'Client',
  },
  de: {
    estimate: 'Kostenvoranschlag', invoice: 'Rechnung', preparedFor: 'Erstellt für', scopeOfWork: 'Leistungsbeschreibung',
    labor: 'Arbeit', materials: 'Material', other: 'Sonstiges', description: 'Beschreibung', qty: 'Menge',
    unit: 'Einheit', rate: 'Einzelpreis', amount: 'Betrag', subtotal: 'Zwischensumme', tax: 'MwSt.', total: 'Gesamt',
    depositDue: 'Anzahlung fällig', depositReceived: 'Anzahlung erhalten', balanceDue: 'Restbetrag',
    notesTerms: 'Hinweise & Bedingungen', date: 'Datum', number: 'Nummer', due: 'Fällig', validUntil: 'Gültig bis',
    acceptedBy: 'Angenommen von', signedOn: 'Elektronisch unterschrieben am', paid: 'Bezahlt', license: 'Lizenz', customer: 'Kunde',
  },
  it: {
    estimate: 'Preventivo', invoice: 'Fattura', preparedFor: 'Preparato per', scopeOfWork: 'Descrizione dei lavori',
    labor: 'Manodopera', materials: 'Materiali', other: 'Altro', description: 'Descrizione', qty: 'Qtà',
    unit: 'Unità', rate: 'Prezzo unit.', amount: 'Importo', subtotal: 'Subtotale', tax: 'IVA', total: 'Totale',
    depositDue: 'Acconto dovuto', depositReceived: 'Acconto ricevuto', balanceDue: 'Saldo dovuto',
    notesTerms: 'Note e condizioni', date: 'Data', number: 'Numero', due: 'Scadenza', validUntil: 'Valido fino al',
    acceptedBy: 'Accettato da', signedOn: 'Firmato elettronicamente il', paid: 'Pagato', license: 'Licenza', customer: 'Cliente',
  },
  pt: {
    estimate: 'Orçamento', invoice: 'Fatura', preparedFor: 'Preparado para', scopeOfWork: 'Âmbito do trabalho',
    labor: 'Mão de obra', materials: 'Materiais', other: 'Outros', description: 'Descrição', qty: 'Qtd',
    unit: 'Unidade', rate: 'Preço unit.', amount: 'Valor', subtotal: 'Subtotal', tax: 'Imposto', total: 'Total',
    depositDue: 'Sinal a pagar', depositReceived: 'Sinal recebido', balanceDue: 'Saldo devido',
    notesTerms: 'Notas e condições', date: 'Data', number: 'Número', due: 'Vencimento', validUntil: 'Válido até',
    acceptedBy: 'Aceite por', signedOn: 'Assinado eletronicamente em', paid: 'Pago', license: 'Licença', customer: 'Cliente',
  },
  nl: {
    estimate: 'Offerte', invoice: 'Factuur', preparedFor: 'Opgesteld voor', scopeOfWork: 'Omschrijving werkzaamheden',
    labor: 'Arbeid', materials: 'Materialen', other: 'Overig', description: 'Omschrijving', qty: 'Aantal',
    unit: 'Eenheid', rate: 'Prijs', amount: 'Bedrag', subtotal: 'Subtotaal', tax: 'Btw', total: 'Totaal',
    depositDue: 'Aanbetaling verschuldigd', depositReceived: 'Aanbetaling ontvangen', balanceDue: 'Restbedrag',
    notesTerms: 'Opmerkingen & voorwaarden', date: 'Datum', number: 'Nummer', due: 'Vervaldatum', validUntil: 'Geldig tot',
    acceptedBy: 'Geaccepteerd door', signedOn: 'Elektronisch ondertekend op', paid: 'Betaald', license: 'Vergunning', customer: 'Klant',
  },
  pl: {
    estimate: 'Kosztorys', invoice: 'Faktura', preparedFor: 'Przygotowano dla', scopeOfWork: 'Zakres prac',
    labor: 'Robocizna', materials: 'Materiały', other: 'Inne', description: 'Opis', qty: 'Ilość',
    unit: 'Jedn.', rate: 'Cena jedn.', amount: 'Kwota', subtotal: 'Suma częściowa', tax: 'Podatek', total: 'Razem',
    depositDue: 'Zaliczka do zapłaty', depositReceived: 'Zaliczka otrzymana', balanceDue: 'Pozostało do zapłaty',
    notesTerms: 'Uwagi i warunki', date: 'Data', number: 'Numer', due: 'Termin', validUntil: 'Ważne do',
    acceptedBy: 'Zaakceptowane przez', signedOn: 'Podpisano elektronicznie dnia', paid: 'Zapłacono', license: 'Licencja', customer: 'Klient',
  },
  cs: {
    estimate: 'Cenová nabídka', invoice: 'Faktura', preparedFor: 'Připraveno pro', scopeOfWork: 'Rozsah prací',
    labor: 'Práce', materials: 'Materiál', other: 'Ostatní', description: 'Popis', qty: 'Množství',
    unit: 'Jedn.', rate: 'Cena/jedn.', amount: 'Částka', subtotal: 'Mezisoučet', tax: 'Daň', total: 'Celkem',
    depositDue: 'Záloha k úhradě', depositReceived: 'Záloha přijata', balanceDue: 'Zbývá uhradit',
    notesTerms: 'Poznámky a podmínky', date: 'Datum', number: 'Číslo', due: 'Splatnost', validUntil: 'Platí do',
    acceptedBy: 'Schváleno', signedOn: 'Elektronicky podepsáno dne', paid: 'Zaplaceno', license: 'Licence', customer: 'Zákazník',
  },
  sk: {
    estimate: 'Cenová ponuka', invoice: 'Faktúra', preparedFor: 'Pripravené pre', scopeOfWork: 'Rozsah prác',
    labor: 'Práca', materials: 'Materiál', other: 'Ostatné', description: 'Popis', qty: 'Množstvo',
    unit: 'Jedn.', rate: 'Cena/jedn.', amount: 'Suma', subtotal: 'Medzisúčet', tax: 'Daň', total: 'Spolu',
    depositDue: 'Záloha na úhradu', depositReceived: 'Záloha prijatá', balanceDue: 'Zostáva uhradiť',
    notesTerms: 'Poznámky a podmienky', date: 'Dátum', number: 'Číslo', due: 'Splatnosť', validUntil: 'Platí do',
    acceptedBy: 'Schválené', signedOn: 'Elektronicky podpísané dňa', paid: 'Zaplatené', license: 'Licencia', customer: 'Zákazník',
  },
  hu: {
    estimate: 'Árajánlat', invoice: 'Számla', preparedFor: 'Készült részére', scopeOfWork: 'Munka leírása',
    labor: 'Munkadíj', materials: 'Anyagok', other: 'Egyéb', description: 'Megnevezés', qty: 'Menny.',
    unit: 'Egység', rate: 'Egységár', amount: 'Összeg', subtotal: 'Részösszeg', tax: 'Adó', total: 'Összesen',
    depositDue: 'Fizetendő előleg', depositReceived: 'Kapott előleg', balanceDue: 'Fennmaradó összeg',
    notesTerms: 'Megjegyzések és feltételek', date: 'Dátum', number: 'Szám', due: 'Határidő', validUntil: 'Érvényes eddig',
    acceptedBy: 'Elfogadta', signedOn: 'Elektronikusan aláírva', paid: 'Fizetve', license: 'Engedély', customer: 'Ügyfél',
  },
  hr: {
    estimate: 'Ponuda', invoice: 'Račun', preparedFor: 'Pripremljeno za', scopeOfWork: 'Opseg radova',
    labor: 'Rad', materials: 'Materijali', other: 'Ostalo', description: 'Opis', qty: 'Kol.',
    unit: 'Jed.', rate: 'Cijena', amount: 'Iznos', subtotal: 'Međuzbroj', tax: 'Porez', total: 'Ukupno',
    depositDue: 'Predujam za platiti', depositReceived: 'Predujam primljen', balanceDue: 'Preostalo za platiti',
    notesTerms: 'Napomene i uvjeti', date: 'Datum', number: 'Broj', due: 'Dospijeće', validUntil: 'Vrijedi do',
    acceptedBy: 'Prihvatio', signedOn: 'Elektronički potpisano', paid: 'Plaćeno', license: 'Licenca', customer: 'Klijent',
  },
  tr: {
    estimate: 'Teklif', invoice: 'Fatura', preparedFor: 'Hazırlanan', scopeOfWork: 'İş kapsamı',
    labor: 'İşçilik', materials: 'Malzemeler', other: 'Diğer', description: 'Açıklama', qty: 'Adet',
    unit: 'Birim', rate: 'Birim fiyat', amount: 'Tutar', subtotal: 'Ara toplam', tax: 'Vergi', total: 'Toplam',
    depositDue: 'Ödenecek depozito', depositReceived: 'Alınan depozito', balanceDue: 'Kalan bakiye',
    notesTerms: 'Notlar ve koşullar', date: 'Tarih', number: 'Numara', due: 'Vade', validUntil: 'Geçerlilik',
    acceptedBy: 'Kabul eden', signedOn: 'Elektronik olarak imzalandı', paid: 'Ödendi', license: 'Lisans', customer: 'Müşteri',
  },
  sv: {
    estimate: 'Offert', invoice: 'Faktura', preparedFor: 'Förberedd för', scopeOfWork: 'Arbetsbeskrivning',
    labor: 'Arbete', materials: 'Material', other: 'Övrigt', description: 'Beskrivning', qty: 'Antal',
    unit: 'Enhet', rate: 'Pris', amount: 'Belopp', subtotal: 'Delsumma', tax: 'Moms', total: 'Totalt',
    depositDue: 'Handpenning att betala', depositReceived: 'Handpenning mottagen', balanceDue: 'Återstående belopp',
    notesTerms: 'Anteckningar och villkor', date: 'Datum', number: 'Nummer', due: 'Förfaller', validUntil: 'Giltig till',
    acceptedBy: 'Godkänd av', signedOn: 'Signerad elektroniskt den', paid: 'Betald', license: 'Licens', customer: 'Kund',
  },
  da: {
    estimate: 'Tilbud', invoice: 'Faktura', preparedFor: 'Udarbejdet til', scopeOfWork: 'Arbejdsbeskrivelse',
    labor: 'Arbejde', materials: 'Materialer', other: 'Andet', description: 'Beskrivelse', qty: 'Antal',
    unit: 'Enhed', rate: 'Pris', amount: 'Beløb', subtotal: 'Subtotal', tax: 'Moms', total: 'I alt',
    depositDue: 'Depositum til betaling', depositReceived: 'Depositum modtaget', balanceDue: 'Restbeløb',
    notesTerms: 'Noter og betingelser', date: 'Dato', number: 'Nummer', due: 'Forfald', validUntil: 'Gyldig til',
    acceptedBy: 'Accepteret af', signedOn: 'Underskrevet elektronisk den', paid: 'Betalt', license: 'Licens', customer: 'Kunde',
  },
  nb: {
    estimate: 'Tilbud', invoice: 'Faktura', preparedFor: 'Utarbeidet for', scopeOfWork: 'Arbeidsbeskrivelse',
    labor: 'Arbeid', materials: 'Materialer', other: 'Annet', description: 'Beskrivelse', qty: 'Antall',
    unit: 'Enhet', rate: 'Pris', amount: 'Beløp', subtotal: 'Delsum', tax: 'MVA', total: 'Totalt',
    depositDue: 'Depositum å betale', depositReceived: 'Depositum mottatt', balanceDue: 'Restbeløp',
    notesTerms: 'Merknader og vilkår', date: 'Dato', number: 'Nummer', due: 'Forfall', validUntil: 'Gyldig til',
    acceptedBy: 'Godkjent av', signedOn: 'Signert elektronisk den', paid: 'Betalt', license: 'Lisens', customer: 'Kunde',
  },
  fi: {
    estimate: 'Tarjous', invoice: 'Lasku', preparedFor: 'Laadittu', scopeOfWork: 'Työn kuvaus',
    labor: 'Työ', materials: 'Materiaalit', other: 'Muut', description: 'Kuvaus', qty: 'Määrä',
    unit: 'Yksikkö', rate: 'Hinta', amount: 'Summa', subtotal: 'Välisumma', tax: 'Vero', total: 'Yhteensä',
    depositDue: 'Maksettava ennakko', depositReceived: 'Vastaanotettu ennakko', balanceDue: 'Jäljellä oleva summa',
    notesTerms: 'Huomautukset ja ehdot', date: 'Päivämäärä', number: 'Numero', due: 'Eräpäivä', validUntil: 'Voimassa',
    acceptedBy: 'Hyväksynyt', signedOn: 'Allekirjoitettu sähköisesti', paid: 'Maksettu', license: 'Lisenssi', customer: 'Asiakas',
  },
  id: {
    estimate: 'Estimasi', invoice: 'Faktur', preparedFor: 'Disiapkan untuk', scopeOfWork: 'Lingkup pekerjaan',
    labor: 'Tenaga kerja', materials: 'Bahan', other: 'Lainnya', description: 'Deskripsi', qty: 'Jml',
    unit: 'Satuan', rate: 'Harga', amount: 'Jumlah', subtotal: 'Subtotal', tax: 'Pajak', total: 'Total',
    depositDue: 'Uang muka', depositReceived: 'Uang muka diterima', balanceDue: 'Sisa pembayaran',
    notesTerms: 'Catatan & ketentuan', date: 'Tanggal', number: 'Nomor', due: 'Jatuh tempo', validUntil: 'Berlaku hingga',
    acceptedBy: 'Disetujui oleh', signedOn: 'Ditandatangani secara elektronik pada', paid: 'Lunas', license: 'Lisensi', customer: 'Pelanggan',
  },
  tl: {
    estimate: 'Pagtatantya', invoice: 'Invoice', preparedFor: 'Inihanda para kay', scopeOfWork: 'Saklaw ng trabaho',
    labor: 'Paggawa', materials: 'Mga materyales', other: 'Iba pa', description: 'Paglalarawan', qty: 'Dami',
    unit: 'Yunit', rate: 'Presyo', amount: 'Halaga', subtotal: 'Subtotal', tax: 'Buwis', total: 'Kabuuan',
    depositDue: 'Deposito na babayaran', depositReceived: 'Deposito na natanggap', balanceDue: 'Natitirang bayad',
    notesTerms: 'Mga tala at kundisyon', date: 'Petsa', number: 'Numero', due: 'Takdang petsa', validUntil: 'Wasto hanggang',
    acceptedBy: 'Tinanggap ni', signedOn: 'Elektronikong nilagdaan noong', paid: 'Bayad na', license: 'Lisensya', customer: 'Kliyente',
  },
  vi: {
    estimate: 'Báo giá', invoice: 'Hóa đơn', preparedFor: 'Chuẩn bị cho', scopeOfWork: 'Phạm vi công việc',
    labor: 'Nhân công', materials: 'Vật liệu', other: 'Khác', description: 'Mô tả', qty: 'SL',
    unit: 'Đơn vị', rate: 'Đơn giá', amount: 'Thành tiền', subtotal: 'Tạm tính', tax: 'Thuế', total: 'Tổng cộng',
    depositDue: 'Tiền đặt cọc', depositReceived: 'Đã nhận cọc', balanceDue: 'Còn lại phải trả',
    notesTerms: 'Ghi chú & điều khoản', date: 'Ngày', number: 'Số', due: 'Hạn thanh toán', validUntil: 'Có hiệu lực đến',
    acceptedBy: 'Chấp nhận bởi', signedOn: 'Ký điện tử ngày', paid: 'Đã thanh toán', license: 'Giấy phép', customer: 'Khách hàng',
  },
  ca: {
    estimate: 'Pressupost', invoice: 'Factura', preparedFor: 'Preparat per a', scopeOfWork: 'Abast del treball',
    labor: "Mà d'obra", materials: 'Materials', other: 'Altres', description: 'Descripció', qty: 'Quant.',
    unit: 'Unitat', rate: 'Preu', amount: 'Import', subtotal: 'Subtotal', tax: 'Impost', total: 'Total',
    depositDue: 'Dipòsit a pagar', depositReceived: 'Dipòsit rebut', balanceDue: 'Saldo pendent',
    notesTerms: 'Notes i condicions', date: 'Data', number: 'Número', due: 'Venciment', validUntil: 'Vàlid fins',
    acceptedBy: 'Acceptat per', signedOn: 'Signat electrònicament el', paid: 'Pagat', license: 'Llicència', customer: 'Client',
  },
  so: {
    estimate: 'Qiimayn', invoice: 'Qaansheeg', preparedFor: 'Loo diyaariyay', scopeOfWork: 'Baaxadda shaqada',
    labor: 'Shaqada', materials: 'Alaabta', other: 'Kale', description: 'Sharraxaad', qty: 'Tir.',
    unit: 'Cutub', rate: 'Qiimaha', amount: 'Qadarka', subtotal: 'Wadarta hoose', tax: 'Canshuur', total: 'Wadarta guud',
    depositDue: 'Dhig la bixin doono', depositReceived: 'Dhig la helay', balanceDue: 'Hadhaaga la bixin doono',
    notesTerms: 'Faallooyin iyo shuruudo', date: 'Taariikh', number: 'Lambar', due: 'Xilliga dhammaad', validUntil: 'Ansax ilaa',
    acceptedBy: 'Waa la aqbalay', signedOn: 'Elektaroonik ahaan lagu saxeexay', paid: 'La bixiyay', license: 'Shatiga', customer: 'Macmiil',
  },
  tpi: {
    estimate: 'Estimeit', invoice: 'Invois', preparedFor: 'I redim bilong', scopeOfWork: 'Wok bilong mekim',
    labor: 'Wok', materials: 'Material', other: 'Arapela', description: 'Toksave long en', qty: 'Namba',
    unit: 'Yunit', rate: 'Prais long wanwan', amount: 'Total mani', subtotal: 'Smol total', tax: 'Takis', total: 'Bikpela total',
    depositDue: 'Diposit i mas pe', depositReceived: 'Diposit i kam pinis', balanceDue: 'Mani i stap yet long pe',
    notesTerms: 'Toksave na kondisen', date: 'De', number: 'Namba', due: 'De bilong pe', validUntil: 'I orait inap long',
    acceptedBy: 'I orait long', signedOn: 'Sain electronik long', paid: 'Pinis long pe', license: 'Laisens', customer: 'Kastoma',
  },
  tet: {
    estimate: 'Orsamentu', invoice: 'Fatura', preparedFor: 'Prepara ba', scopeOfWork: 'Ámbitu servisu',
    labor: 'Serbisu', materials: 'Materiál', other: 'Seluk', description: 'Deskrisaun', qty: 'Kuant.',
    unit: 'Unidade', rate: 'Presu', amount: 'Montante', subtotal: 'Subtotál', tax: 'Taxa', total: 'Total',
    depositDue: "Depozitu tenke selu", depositReceived: 'Depozitu simu ona', balanceDue: 'Saldu tenke selu',
    notesTerms: 'Nota no kondisaun', date: 'Data', number: 'Númeru', due: 'Prazu', validUntil: "Válidu to'o",
    acceptedBy: 'Aseita husi', signedOn: 'Asina eletronikamente iha', paid: 'Selu ona', license: 'Lisensa', customer: 'Kliente',
  },
  ht: {
    estimate: 'Estimasyon', invoice: 'Fakti', preparedFor: 'Prepare pou', scopeOfWork: 'Deskripsyon travay la',
    labor: 'Men dèv', materials: 'Materyèl', other: 'Lòt bagay', description: 'Deskripsyon', qty: 'Kantite',
    unit: 'Inite', rate: 'Pri inite', amount: 'Montan', subtotal: 'Soutotal', tax: 'Taks', total: 'Total',
    depositDue: 'Depo pou peye', depositReceived: 'Depo resevwa', balanceDue: 'Rès pou peye',
    notesTerms: 'Nòt ak kondisyon', date: 'Dat', number: 'Nimewo', due: 'Dat limit', validUntil: 'Valid jiska',
    acceptedBy: 'Aksepte pa', signedOn: 'Siyen elektwonikman le', paid: 'Peye', license: 'Lisans', customer: 'Kliyan',
  },
};

/** Labels for a language, English as the fallback. */
export function stringsFor(lang: string): PdfStrings {
  return PDF_STRINGS[lang] ?? PDF_STRINGS.en;
}
