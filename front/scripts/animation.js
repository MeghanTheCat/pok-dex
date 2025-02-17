document.addEventListener('DOMContentLoaded', () => {
    const pokemonCards = document.querySelectorAll('.pokemon-card');
    const buttons = document.querySelectorAll('button');

    pokemonCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });

    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = 'var(--accent-color)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = 'var(--secondary-color)';
        });
    });
});
