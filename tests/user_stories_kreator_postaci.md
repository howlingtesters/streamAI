# User Stories - Kreator Postaci

Ten dokument zawiera user stories dla aplikacji Kreator Postaci.

## User Story #1: Tworzenie postaci

**Jako** użytkownik  
**Chcę** móc stworzyć postać z imieniem, rasą, klasą i statystykami  
**Aby** móc zbudować swoją drużynę

### Kryteria akceptacji:
- [ ] Powinienem móc wpisać imię postaci (domyślnie "Bohater")
- [ ] Powinienem móc wybrać rasę z listy: Człowiek, Elf, Krasnolud, Ork
- [ ] Powinienem móc wybrać klasę: Wojownik, Łotrzyk, Czarodziej, Zwiadowca
- [ ] Powinienem móc rozdzielić 15 punktów między statystykami: Siła, Spryt, Energia, Zdrowie
- [ ] Powinienem móc dodać postać do drużyny po wypełnieniu formularza
- [ ] Powinienem móc stworzyć wiele postaci (do 4)

## User Story #2: Wyświetlanie listy postaci

**Jako** użytkownik  
**Chcę** widzieć listę moich stworzonych postaci  
**Aby** móc zarządzać drużyną

### Kryteria akceptacji:
- [ ] Powinienem widzieć listę wszystkich stworzonych postaci
- [ ] Każda postać powinna wyświetlać: imię, rasę, klasę i statystyki
- [ ] Lista powinna być aktualizowana po dodaniu nowej postaci

## User Story #3: Usuwanie postaci

**Jako** użytkownik  
**Chcę** móc usunąć postać z drużyny  
**Aby** móc modyfikować skład drużyny

### Kryteria akceptacji:
- [ ] Powinienem móc usunąć postać z listy
- [ ] Po usunięciu postać powinna zniknąć z listy
- [ ] Powinienem móc dodać nową postać po usunięciu

## User Story #4: Walidacja formularza

**Jako** użytkownik  
**Chcę** otrzymywać komunikaty o błędach  
**Aby** wiedzieć co muszę poprawić w formularzu

### Kryteria akceptacji:
- [ ] Powinienem otrzymać komunikat, jeśli nie wybrałem klasy
- [ ] Powinienem otrzymać komunikat, jeśli nie rozdzieliłem wszystkich punktów
- [ ] Powinienem otrzymać komunikat, jeśli przekroczyłem limit punktów
- [ ] Powinienem otrzymać komunikat, jeśli próbuję dodać 5. postać

## User Story #5: Zarządzanie punktami statystyk

**Jako** użytkownik  
**Chcę** widzieć ile punktów zostało do rozdysponowania  
**Aby** móc poprawnie rozdzielić statystyki

### Kryteria akceptacji:
- [ ] Powinienem widzieć licznik pozostałych punktów (start: 15)
- [ ] Licznik powinien się aktualizować przy zmianie statystyk
- [ ] Nie powinienem móc przekroczyć dostępnych punktów

## User Story #6: Zapisywanie drużyny

**Jako** użytkownik  
**Chcę** aby moja drużyna była zapisywana w localStorage  
**Aby** nie tracić danych po odświeżeniu strony

### Kryteria akceptacji:
- [ ] Drużyna powinna być zapisywana w localStorage
- [ ] Po odświeżeniu strony drużyna powinna się przywrócić
- [ ] Dane powinny być zachowane między sesjami

## User Story #7: Limit postaci

**Jako** użytkownik  
**Chcę** móc stworzyć maksymalnie 4 postaci  
**Aby** mieć zbalansowaną drużynę

### Kryteria akceptacji:
- [ ] Powinienem móc stworzyć maksymalnie 4 postaci
- [ ] Po dodaniu 4. postaci, przycisk "Dodaj postać" powinien być zablokowany
- [ ] Powinienem otrzymać komunikat o osiągnięciu limitu

## User Story #8: Edycja postaci

**Jako** użytkownik  
**Chcę** móc edytować istniejącą postać  
**Aby** poprawić błędy bez usuwania i tworzenia na nowo

### Kryteria akceptacji:
- [ ] Powinienem móc kliknąć na postać w liście, aby ją edytować
- [ ] Formularz powinien się wypełnić danymi wybranej postaci
- [ ] Powinienem móc zmienić dane i zapisać zmiany
- [ ] Zmiany powinny być widoczne w liście postaci

## User Story #9: Resetowanie formularza

**Jako** użytkownik  
**Chcę** móc zresetować formularz  
**Aby** szybko zacząć tworzyć nową postać

### Kryteria akceptacji:
- [ ] Powinienem móc zresetować formularz do wartości domyślnych
- [ ] Po resecie wszystkie pola powinny wrócić do wartości początkowych
- [ ] Punkty statystyk powinny wrócić do 15

## User Story #10: Wyświetlanie szczegółów postaci

**Jako** użytkownik  
**Chcę** widzieć szczegółowe informacje o postaci  
**Aby** lepiej zarządzać drużyną

### Kryteria akceptacji:
- [ ] Powinienem widzieć szczegóły każdej postaci w liście
- [ ] Szczegóły powinny zawierać: imię, rasę, klasę, wszystkie statystyki
- [ ] Powinienem móc zobaczyć podsumowanie punktów statystyk

