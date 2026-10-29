# D4LT Learn — Mfumo wa Kufundishia

Walimu, wanafunzi, masomo yenye code ya kujiunga, video na PDF. Unafanya kazi vizuri kwenye PC na tablets (na simu).

## Lugha na mandhari (Language & theme)
- **Lugha:** English ndiyo chaguo-msingi. Kitufe cha **EN | SW** (ukurasa wa kuingia na menyu ya pembeni; kwenye simu juu ya skrini) kinabadilisha mfumo mzima, pamoja na ujumbe wa seva, arifa na masharti. Chaguo linahifadhiwa kwenye kivinjari.
- **Mandhari:** dark (nyeusi + kijani-neon) pekee. Rangi zote ni tokens juu ya `public/style.css`.
- **Kuongeza/kubadilisha maneno:** kila faili la `public/*.js` lina `addStrings({en:{...}, sw:{...}})`.

## Materials nyingi kwenye topic moja
- Mwalimu anapakia topic mara moja na **faili nyingi pamoja**: video, PDF, Word, PowerPoint, Excel, na/au viungo (YouTube n.k.), hadi 20 kwa topic. Anaweza kuchagua mara nyingi kuongeza kwenye orodha kabla ya "Upload topic".
- Baadaye: kwenye topic bofya **"Add materials"** kuongeza zaidi, au **"Remove this material"** kuondoa moja (material ya kwanza ya topic inaondolewa kwa kufuta topic nzima).
- Mwanafunzi anaona vichupo (tabs) vya materials juu ya kicheza na kubadilisha kati yake. "Nimemaliza", quiz na mtihani vinahesabiwa kwa **topic**, si kwa kila material.

## Wasifu wa mwalimu (profile)
- Mwalimu akiingia: **Account → My teacher profile**: username (lazima, ya kipekee, mf. `asha.juma`), namba ya simu, bio, na hadi viungo 8 vya mitandao (LinkedIn, X, Facebook, Instagram, GitHub, YouTube, TikTok, WhatsApp, Website au jina lolote). Hadi akijaza username, dashboard yake inaonyesha ukumbusho.
- Wanafunzi wanaona kadi ya mwalimu (jina, @username, bio, simu, viungo) kwenye ukurasa wa somo (hata kabla ya kujiunga) na "Teacher: jina" kwenye kila topic. Ni mwalimu aliyepangiwa somo (na msimamizi) anayeongeza topics/materials/quiz/meetings kwenye somo hilo.
- Msimamizi anaona username za walimu kwenye orodha ya Walimu. Kuingia bado ni kwa barua pepe + nenosiri.

## Kuendesha (Kali Linux / Windows / Mac)
Unahitaji Node.js 18+.

    cd lms
    npm install
    npm start

Fungua http://localhost:3000. Wanafunzi kwenye mtandao mmoja wanaingia kupitia `http://IP-YAKO:3000`.

## Kuingia mara ya kwanza (Msimamizi)
Seva ikianza kwa mara ya kwanza, inatengeneza admin na **nenosiri la nasibu lenye nguvu**, na kulionyesha **mara moja tu** kwenye terminal (barua pepe: `admin@d4lt.local`). Utaombwa kulibadilisha na kukubali masharti ukiingia. Au weka mwenyewe kabla ya kuanza:

    ADMIN_EMAIL=wewe@mfano.com ADMIN_PASSWORD='Nenosiri-Imara-47#' npm start

Kama tayari ulikuwa na admin mwenye `admin123`, ukiingia utalazimika kulibadilisha.

## Jinsi ya kutumia
1. **Msimamizi:** Walimu → "Mwalimu mpya". Kisha Masomo → "Somo jipya", chagua darasa na mwalimu. 
2. **Mwalimu:** ndani ya somo → "Code za kujiunga" → andika majina ya wanafunzi (mmoja kwa kila mstari) → "Tengeneza code". Kila mwanafunzi anapata code yake.
3. **Mwanafunzi:** anajisajili (nenosiri imara + kukubali masharti), kisha anaweka code yake kwenye "Jiunge".
4. **Mwalimu/Msimamizi:** fungua somo → "Ongeza somo" → pakia video (MP4/WebM) au PDF, au weka kiungo cha YouTube.
5. Mwanafunzi anabofya "Nimemaliza somo hili" na maendeleo yanaonekana kwenye kadi ya somo.

## Mambo muhimu
- Faili zinalindwa: ni wanafunzi waliojiunga, mwalimu wa somo, na msimamizi tu wanaoweza kuziona.
- Video: tumia MP4 (H.264/AAC) ili icheze kwenye vifaa vyote.
- Ukubwa wa juu wa faili: 2GB (badilisha `fileSize` kwenye server.js).
- Data iko kwenye `lms.db` na faili kwenye `uploads/` — hifadhi nakala (backup) ya vyote viwili.
- Ukiweka mtandaoni (Railway n.k.): tumia diski ya kudumu (volume) kwa `lms.db` na `uploads/`, vinginevyo data hupotea kila deploy.

## Quiz na mtihani wa mwisho
- **Quiz ya somo:** mwalimu anafungua somo → "Quiz (n/10)" → "+ Swali jipya". Aina tatu: chaguo nyingi, linganisha (jozi), jibu fupi. Kila swali lina alama zake. Upeo ni maswali 10 kwa quiz.
- Mwanafunzi akibofya "Nimemaliza somo hili", quiz inafunguka. Mfumo unasahihisha, unaonyesha alama, maswali aliyokosa na majibu sahihi, na anaweza kurudia quiz. Alama bora ndiyo inayohesabiwa.
- **Kupita quiz:** 50% au zaidi. Linganisha hupewa alama kiasi kulingana na jozi sahihi. Jibu fupi halijali herufi kubwa/ndogo wala alama za uandishi.
- **Mtihani wa mwisho:** unafunguka mwanafunzi akimaliza masomo yote na kupita kila quiz. Mwalimu anaweka maswali (hakuna kikomo cha 10), "idadi ya maswali kwa kila mwanafunzi" (maswali huchaguliwa kwa nasibu kutoka kwenye bank; 0 = yote) na "mara za kufanya mtihani" (kawaida 1; 0 = bila kikomo).
- **Swali la essay / maelezo (quiz za masomo tu, si mtihani wa mwisho):** mwalimu anachagua aina "Essay / maelezo", anaandika swali, **alama zote za swali**, na anaweza kuambatisha hadi faili 5 za aina yoyote (zip, PDF, Word… MB 100 kila moja) ambazo mwanafunzi anazipakua kufanyia kazi. Mwanafunzi anajibu kwa **kuandika jibu** na/au **kupakia faili la majibu** (aina yoyote, hadi MB 50) kisha "Wasilisha jibu" kwenye kadi ya swali hilo. Hali inakuwa **Not marked** hadi mwalimu asahihishe, kisha **Marked**.
- Mwalimu anaona jopo la "Essay answers to mark" kwenye ukurasa wa kozi: anapakua au kusoma jibu, anaweka alama (0 hadi alama za swali) na maoni mafupi. **Nusu ya alama au zaidi = amefaulu; chini ya nusu = amefeli** na anaruhusiwa kurudia swali hilo (jibu jipya lazima lisahihishwe tena; majibu ya zamani yanabaki kwenye hifadhidata). Mwanafunzi hawezi kuwasilisha tena jibu likiwa halijasahihishwa au baada ya kufaulu.
- **Kuona faili la jibu ndani ya system:** kila faili la jibu lina vitufe **Open** na **Download**. Open inafanya kazi kwa maandishi (txt, md, csv, code…), Word/ODT/RTF (vinabadilishwa kuwa maandishi na LibreOffice kwenye seva) na PDF; kwa aina nyingine (zip, exe…) Open imezimwa na Download tu ndiyo inafanya kazi. Mwanafunzi na mwalimu wote wanapata vitufe hivi; mwalimu anasoma, kisha anatoa alama kwenye dirisha hilo hilo.
- Somo linahesabiwa kuwa limefaulu (na mtihani wa mwisho kufunguka) pale sehemu ya kawaida ya quiz ≥ 50% **na** essay zote zimefaulu. Faili za essay ziko `uploads/essay/` (zinaingia kwenye backup ya `uploads/`), zinatolewa kama "attachment" tu kwa wenye ruhusa; faili zisizotumika zinafutwa seva inapoanza.
- Mwalimu anaona kwenye orodha ya wanafunzi: masomo yaliyokamilika, quiz zilizopitwa, na alama bora ya mtihani.

## Meetings za live na arifa
- **Mwalimu/Msimamizi:** fungua somo → "Meetings za live" → "+ Meeting mpya". Weka kichwa, kiungo (Zoom/Meet/Teams), passcode (kama ipo), tarehe na muda wa **kuanza** na **kuisha**.
- **Mwanafunzi:** anapata arifa meeting ikipangwa, **dakika 30 kabla ya kuanza**, na kila mwalimu akibadilisha muda au kufuta meeting. Arifa zinaonekana kwenye menyu ya "Arifa" (na toast ukiwa ndani ya mfumo; unaweza kuwasha arifa za kivinjari).
- **Kitufe cha "Jiunge":** kinafanya kazi tu kuanzia muda wa kuanza hadi wa kuisha (seva ndiyo inaamua, si saa ya simu ya mwanafunzi). Kabla ya hapo na baada ya hapo kimezimwa. Kiungo na passcode havionyeshwi kwa mwanafunzi hadi meeting iwe live.
- **Kubadilisha muda:** "Badilisha muda / taarifa" → wanafunzi wanaarifiwa muda mpya (imesogezwa mbele au imerudishwa nyuma). **Kufuta:** wanafunzi wanaarifiwa.
- **Recording:** meeting ikiisha, mwalimu anabofya "Pakia recording". Kuanzia hapo mwanafunzi anaona kitufe cha **"Angalia recorded meeting"**.
- Saa za arifa zinaandikwa kwa `Africa/Dar_es_Salaam` (badilisha kwa `TIMEZONE=...`). Vikumbusho vinakaguliwa kila sekunde 30 na seva, kwa hiyo seva lazima iwe inaendelea kufanya kazi.

## Usalama
- **Nenosiri imara:** angalau herufi 10, herufi kubwa na ndogo, namba na alama; hairuhusu maneno rahisi (password, 123456...), mfuatano (abcde), wala jina/barua pepe yako. Nenosiri dhaifu linakataliwa na ujumbe "Tengeneza nenosiri imara". Mtu mwenye nenosiri la zamani lisilofikia kiwango analazimishwa kulibadilisha akiingia.
- **Code za kujiunga:** kila mwanafunzi ana code yake (herufi 8), inatumika mara moja, inaisha muda (siku 7/14/30). Mwalimu anaona code ni ya nani na akaunti gani iliitumia. "Mtoe darasani" inamtoa na kuua code yake. Code ya pamoja ya zamani haipo tena.
- **Masharti na Sera ya Faragha:** lazima yakubaliwe wakati wa kujisajili. Waliopo na walimu wapya wanaombwa kukubali wakiingia. Ukibadilisha maandishi, badilisha `TERMS_VERSION` (security.js) na `TERMS_DATE`/`TERMS_HTML` (public/security.js): kila mtu ataombwa kukubali upya. **Maandishi ni rasimu: shule/chuo kipitie (na mshauri wa sheria) kabla ya matumizi rasmi.**
- **Kuzuia kubahatisha nenosiri:** majaribio 5 yaliyoshindwa kwa barua pepe moja = kufungwa dakika 15. Pia kuna vikomo vya usajili na kubahatisha code.
- **Vikao:** kikao kinaisha baada ya saa 24 (`SESSION_HOURS`). Kubadilisha nenosiri au admin kulibadilisha kunatoa vifaa vyote vingine.
- **Mengine:** headers za usalama (CSP n.k.), ulinzi wa CSRF, siri ya JWT inahifadhiwa kwenye `.jwt_secret`, viungo vinakubali http/https tu, faili za PDF/video zinakaguliwa maudhui yake, hitilafu za ndani hazionyeshwi, na kuna kumbukumbu za usalama (menyu ya "Usalama" kwa admin).
- **Wakati wa kuweka mtandaoni:** tumia **HTTPS** (mf. Caddy/Nginx/Cloudflare). Weka `TRUST_PROXY=1` ukiwa nyuma ya proxy na `COOKIE_SECURE=1` ili cookie itumwe kwa HTTPS tu. Hifadhi nakala ya `lms.db`, `uploads/` na `.jwt_secret` na usizishiriki.

## Upande wa mwanafunzi: katalogi ya madarasa
- Mwanafunzi akishajisajili anaona **madarasa yote** pamoja na maelezo na **topics** zake (jina, aina: Video/PDF/Kiungo, maelezo).
- Maudhui yenyewe (video, PDF, viungo) yamefungwa hadi ajiunge. Akibofya topic anaona ujumbe: lipia au wasiliana na admin kwa WhatsApp kupata code, na **sanduku la kuweka code** kujiunga na darasa hilo.
- Seva haitoi faili wala viungo vya maudhui kwa asiyejiunga (preview inatoa majina na maelezo tu).
- Namba ya WhatsApp ya admin ni `+255747878051`. Ibadilishe kwa `ADMIN_WHATSAPP=+255...` kabla ya `npm start`. Kitufe cha WhatsApp kinafungua mazungumzo na ujumbe ulioandaliwa (jina la darasa na jina la mwanafunzi).

## Nyaraka ndani ya system (PDF, Word, PowerPoint, Excel...)
- Mwalimu anaweza kupakia **waraka wa aina yoyote hii**: PDF, Word (.doc/.docx), PowerPoint (.ppt/.pptx), Excel (.xls/.xlsx), OpenDocument (.odt/.odp/.ods), RTF, TXT, CSV (kikomo MB 100).
- Mfumo unaubadilisha kuwa **kurasa za picha** na mwanafunzi anauona ndani ya system: kurasa, zoom, namba ya ukurasa. **Hakuna toolbar ya PDF**, hakuna kitufe cha kupakua au kuchapisha, na faili asili haipewi wanafunzi. Juu ya kurasa kunaonekana alama hafifu ya jina na barua pepe ya mwanafunzi (kuzuia kusambaza screenshot).
- Hakuna kitufe cha kupakua faili asili kwa mtu yeyote. Faili asili inabaki kwenye seva (inatumika kubadilisha upya waraka).
- **Skrini nzima:** kitufe cha "Skrini nzima" kwenye kicheza kinajaza skrini ndani ya ukurasa huohuo (hakifunguli tab wala ukurasa mpya). Esc au kitufe cha "Funga skrini nzima" kinarudisha. Kwenye simu zisizosapoti Fullscreen API (mf. iPhone) kinatumia hali ya ndani inayojaza dirisha lote.
- **Zana zinazohitajika kwenye seva:**
  - **LibreOffice** (kwa Word/PowerPoint/Excel n.k.) na **poppler** (`pdftoppm`, kwa kutengeneza kurasa).
  - Ubuntu/Debian: `sudo apt install libreoffice-writer libreoffice-impress libreoffice-calc poppler-utils fonts-dejavu fonts-liberation`
  - Windows: sakinisha LibreOffice, na poppler (mf. `choco install poppler` au `scoop install poppler`). Kama hazipo kwenye PATH, weka `SOFFICE_PATH` na `PDFTOPPM_PATH` kwa njia kamili.
  - Bila poppler: PDF zinaonekana kwa njia mbadala ya kivinjari (vitufe vya kivinjari vinaweza kuonekana). Bila LibreOffice: aina za Word/PowerPoint/Excel zinakataliwa kwa ujumbe wazi; PDF bado zinafanya kazi.
- Mabadiliko yanafanyika kwenye seva moja baada ya nyingine (foleni), na mwanafunzi anaona "Waraka unaandaliwa..." hadi iwe tayari. PDF ulizopakia zamani zinabadilishwa kiotomatiki seva ikianza. Mwalimu akiona hitilafu anaweza kubofya "Jaribu tena".
- Kikomo cha kurasa: 400 kwa waraka (`DOC_MAX_PAGES`). Ubora wa ukurasa: upana wa pikseli 1400 (`DOC_PAGE_WIDTH`).

## Madarasa ya Bure na VIP, token za kundi, na malipo ya Snippe

**Free / VIP:** Admin anapounda somo huchagua *Free* (mwanafunzi anajiunga kwa kubofya mara moja, material yote bure) au *VIP* (anaweka bei kwa TZS, kuanzia 500; 0 = token tu). Masomo yaliyokuwepo kabla ya toleo hili yamekuwa VIP (token tu hadi uweke bei).

**Token za kundi (admin tu, VIP tu):** Kwenye ukurasa wa somo → "Bulk token": weka jina, idadi ya watu, siku za kuisha, na ujumbe utakaoonekana token ikijaa. Kila mwanafunzi anaitumia mara moja. Code za mtu mmoja mmoja bado zipo kwa walimu.

**Malipo ya mtandaoni (Snippe):** weka kwenye server (environment variables):

| Variable | Maana |
|---|---|
| `SNIPPE_API_KEY` | API key kutoka Snippe dashboard |
| `SNIPPE_WEBHOOK_SECRET` | siri ya webhook |
| `PUBLIC_URL` | anwani ya HTTPS ya tovuti yako, mf. `https://learn.example.com` |
| `SNIPPE_BASE_URL` | hiari, chaguo-msingi `https://api.snippe.sh` |
| `SNIPPE_MOCK=1` | majaribio tu: malipo bandia, hakuna pesa |

Kwenye Snippe weka webhook URL: `PUBLIC_URL/api/payments/webhook` (matukio `payment.completed|failed|expired|voided`). Server huthibitisha saini ya HMAC-SHA256, haikubali ombi la zaidi ya dakika 5, na haisajili tukio lilelile mara mbili. Mwanafunzi anaandikishwa **tu** baada ya webhook halali au server kuthibitisha kwa Snippe — si kwa browser. Admin anaona malipo yote kwenye menyu ya "Payments".

> Kumbuka: muunganisho halisi wa Snippe haujajaribiwa bila funguo zako. Jaribu kwanza malipo madogo (TZS 500). Kama majibu ya Snippe yana muundo tofauti kidogo na ilivyotarajiwa, angalia `payments.js`.

## Kupakua material (download)
Mwalimu anapopakia faili, kuna kisanduku "Students can download these files". Akikitiki, mwanafunzi anaona kitufe cha **Download** kwa material hiyo; asipokitiki, kitufe hakionekani kabisa na server inakataa ombi la kupakua. Mwalimu anaweza kubadilisha baadaye kwa kitufe "Allow download / Disable download" kwa kila material. Viungo (links) havipakuliwi.
