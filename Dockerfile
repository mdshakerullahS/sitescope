FROM ghcr.io/puppeteer/puppeteer:22

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

USER root
RUN chown -R pptruser:pptruser /app
USER pptruser

COPY --chown=pptruser:pptruser package*.json ./
RUN npm ci 

COPY --chown=pptruser:pptruser . .
RUN npm run build

ENV CHROME_PATH=/usr/bin/google-chrome-stable

EXPOSE 3000
CMD ["npm", "start"]