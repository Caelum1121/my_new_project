# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# ---- nginx serve ----
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
# ✅ Font Awesome v4 (fontawesome-webfont.*)
# Provides .eot .svg .ttf .woff .woff2 files
COPY --from=build /app/node_modules/font-awesome/fonts/ \
  /usr/share/nginx/html/fonts/

# ✅ Simple Line Icons (already present, harmless to recopy)
COPY --from=build /app/node_modules/simple-line-icons/fonts/ \
  /usr/share/nginx/html/fonts/

# ✅ Poppins (your CSS shows poppins-*-*-normal.woff2 from @fontsource)
# This is where @fontsource stores the woff2 files:
COPY --from=build /app/node_modules/@fontsource/poppins/files/ \
  /usr/share/nginx/html/fonts/

# (Optional) If some vendor uses /webfonts instead of /fonts:
RUN [ -d /usr/share/nginx/html/webfonts ] || ln -s /usr/share/nginx/html/fonts /usr/share/nginx/html/webfonts
EXPOSE 80
