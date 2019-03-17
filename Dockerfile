# Global arguments
ARG USERNAME=chili
ARG HOME_DIR=/home/${USERNAME}
ARG APP_BUNDLE_DIR=${HOME_DIR}/dist
ARG BUILD_SCRIPTS_DIR=/opt/build_scripts
ARG NODE_VERSION=11.6.0

# BUILDER specifications
FROM debian:jessie as builder

# global-variables declaration
ARG USERNAME
ARG HOME_DIR
ARG APP_BUNDLE_DIR
ARG BUILD_SCRIPTS_DIR
ARG NODE_VERSION

# build-dependent ENV variables, because it will be used by scripts
ENV APP_BUNDLE_DIR				${APP_BUNDLE_DIR}
ENV APP_SOURCE_WRAPPER_DIR		${HOME_DIR}/frog
ENV APP_SOURCE_DIR 				${HOME_DIR}/frog/frog
ENV BUILD_SCRIPTS_DIR			${BUILD_SCRIPTS_DIR}
ENV NODE_VERSION 				${NODE_VERSION}

# add non-root user 
RUN useradd -rm -d $HOME_DIR -s /bin/bash -g root -u 1100 $USERNAME
COPY deployment/scripts/.bash_aliases deployment/scripts/.bashrc $HOME_DIR/

# add build scripts
COPY deployment/scripts $BUILD_SCRIPTS_DIR
RUN chmod -R 770 $BUILD_SCRIPTS_DIR

# copt app source dir
COPY . $APP_SOURCE_WRAPPER_DIR
RUN chown -R $USERNAME $HOME_DIR

# install all dependencies, build app, clean up
RUN $BUILD_SCRIPTS_DIR/install-deps.sh && \
	$BUILD_SCRIPTS_DIR/install-node.sh

# install meteor, frog-setup and build process as non-root user
USER $USERNAME
RUN $BUILD_SCRIPTS_DIR/install-meteor.sh && \
	$BUILD_SCRIPTS_DIR/frog-setup.sh && \
	$BUILD_SCRIPTS_DIR/build-meteor.sh 

######### Runtime Image Specifications #########
# TODO: why not nodejs ?
FROM debian:jessie

# global-variables declaration
ARG USERNAME
ARG HOME_DIR
ARG APP_BUNDLE_DIR
ARG BUILD_SCRIPTS_DIR
ARG NODE_VERSION

# add non-root user
RUN useradd -rm -d $HOME_DIR -s /bin/bash -g root -u 1100 $USERNAME
# RUN adduser --disabled-password -h $HOME_DIR -s /bin/bash -G root -u 1100 $USERNAME
COPY --chown=chili:root deployment/scripts/.bash_aliases deployment/scripts/.bashrc $HOME_DIR/
COPY --chown=chili:root --from=builder ${APP_BUNDLE_DIR} ${APP_BUNDLE_DIR}
COPY --chown=chili:root --from=builder ${BUILD_SCRIPTS_DIR} ${BUILD_SCRIPTS_DIR}

RUN $BUILD_SCRIPTS_DIR/install-deps.sh && \
	$BUILD_SCRIPTS_DIR/install-node.sh && \
	$BUILD_SCRIPTS_DIR/post-install-cleanup.sh

# RUN chown -R $USERNAME $HOME_DIR
USER $USERNAME
WORKDIR $APP_BUNDLE_DIR/bundle
CMD ["sleep", "36000"]

# start the app
# ENTRYPOINT ["./entrypoint.sh"]
# CMD ["node", "main.js"]